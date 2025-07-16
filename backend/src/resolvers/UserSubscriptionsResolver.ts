import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'

import {
  UserSubscription,
  UserSubscriptionCreateInput,
  UserSubscriptionUpdateInput,
} from '../entities/UserSubscription'
import { Plan } from '../entities/Plan'
import { User } from '../entities/User'
import { AuthContextType, UserRole } from '../types'
import { getUserFromContext } from './utils'
import { Not } from 'typeorm'

@Resolver()
export class UserSubscriptionsResolver {
  // List of all users and their subscriptions
  @Authorized(UserRole.ADMIN)
  @Query(() => [User])
  async getAllUsersSubscriptions(): Promise<User[]> {
    const users = await User.find({
      relations: ['subscriptions', 'subscriptions.plan'],
      order: { subscriptions: { subscribedAt: 'DESC' } },
    })
    return users
  }

  // Active subscription: admin and user (own subscription) can see active subscription
  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Query(() => UserSubscription)
  async getActiveSubscription(
    @Ctx() context: AuthContextType,
  ): Promise<UserSubscription> {
    const user = await getUserFromContext(context)
    if (!user) {
      throw new Error('User not found')
    }
    const isAdmin = context.user.role === UserRole.ADMIN
    const where = isAdmin
      ? { user: { id: user.id } }
      : {
          user: { id: user.id },
          isActive: true,
          // Active subscription can be:
          // - Free plan: unsubscribedAt is null and expiresAt is null
          // - Paid plan: unsubscribedAt is null and expiresAt is date
          // - Paid plan but unsubscribed: unsubscribedAt is date and expiresAt is date (still active until expiry)
        }
    const subscription = await UserSubscription.findOne({
      where,
      relations: ['plan', 'user'],
      order: { subscribedAt: 'DESC' },
    })

    if (!subscription) {
      throw new Error('No active subscription found')
    }

    return subscription
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => UserSubscription)
  async subscribe(
    @Arg('data', () => UserSubscriptionCreateInput)
    data: UserSubscriptionCreateInput,
    @Ctx() context: AuthContextType,
  ): Promise<UserSubscription> {
    try {
      const currentUser = await getUserFromContext(context)
      if (!currentUser) {
        throw new Error('User not found')
      }

      // If not admin, user can only create subscriptions for themselves
      if (
        currentUser.role !== UserRole.ADMIN &&
        data.userId !== currentUser.id
      ) {
        throw new Error('You can only create subscriptions for yourself')
      }

      // Verify that the user and plan exist
      const [user, plan] = await Promise.all([
        User.findOne({ where: { id: data.userId } }),
        Plan.findOne({ where: { id: data.planId } }),
      ])

      if (!user) {
        throw new Error('User not found')
      }

      if (!plan) {
        throw new Error('Plan not found')
      }

      // Check if user has an active subscription and handle it (if user has an active subscription, we need to update it)
      const existingSubscription = await UserSubscription.findOne({
        where: {
          user: { id: data.userId },
          isActive: true,
        },
        relations: ['plan'],
      })

      if (existingSubscription) {
        // Check if user is trying to subscribe to the same plan they already have
        if (existingSubscription.plan.id === data.planId) {
          throw new Error('You are already subscribed to this plan')
        }

        // For paid plans: mark as unsubscribed but keep active until expiry
        // For free plans: immediately deactivate
        const isFreePlan = existingSubscription.expiresAt === null

        await UserSubscription.update(existingSubscription.id, {
          unsubscribedAt: new Date(),
          isActive: isFreePlan
            ? false
            : existingSubscription.expiresAt &&
                existingSubscription.expiresAt < new Date()
              ? false
              : true, // Keep active for paid plans until expiry
          expiresAt: isFreePlan ? new Date() : existingSubscription.expiresAt,
        })
      }

      // Set expiration based on plan type
      const expiresAt =
        plan.price === 0
          ? null // Free plan: no expiration
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Paid plan: 30 days

      const newSubscription = new UserSubscription()
      Object.assign(newSubscription, {
        plan: plan,
        user: user,
        subscribedAt: new Date(),
        isActive: true,
        expiresAt: expiresAt,
      })

      const createdSubscription = await newSubscription.save()
      return createdSubscription
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  // Automatically update a subscription when the use pay for an existing subscription (handle change of expiration date)
  @Authorized(UserRole.ADMIN)
  @Mutation(() => UserSubscription, { nullable: true })
  async updateUserSubscription(
    @Arg('id', () => ID) id: string,
    @Arg('data', () => UserSubscriptionUpdateInput)
    data: UserSubscriptionUpdateInput,
  ): Promise<UserSubscription | null> {
    try {
      const subscription = await UserSubscription.findOne({
        where: { id },
        relations: ['user', 'plan'],
      })

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      Object.assign(subscription, data)
      const updatedSubscription = await subscription.save()

      return updatedSubscription
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => Boolean)
  async unsubscribe(
    @Ctx() context: AuthContextType,
    @Arg('userId', () => ID) userId: string,
  ): Promise<boolean> {
    try {
      const currentUser = await getUserFromContext(context)
      if (!currentUser) {
        throw new Error('User not found')
      }

      let subscription: UserSubscription | null

      const isAdmin = context.user.role === UserRole.ADMIN

      if (userId && isAdmin) {
        // Admin functionality: cancel a specific subscription by ID
        subscription = await UserSubscription.findOne({
          where: {
            user: { id: userId },
            isActive: true,
          },
          relations: ['user', 'plan'],
        })

        if (!subscription) {
          throw new Error('Subscription not found')
        }
      } else {
        // Regular user functionality: cancel their own active subscription
        subscription = await UserSubscription.findOne({
          where: {
            user: { id: context.user.id },
            isActive: true,
          },
          relations: ['user', 'plan'],
        })

        if (!subscription) {
          throw new Error('No active subscription found')
        }
      }

      const isPaidPlan = subscription.plan.price > 0

      if (isPaidPlan) {
        // For paid plans: mark as unsubscribed but keep active until expiry
        subscription.unsubscribedAt = new Date()
        // Keep isActive true until the subscription actually expires
        await subscription.save()
      } else {
        // For free plans: immediately deactivate and create new default subscription
        subscription.isActive = false
        subscription.unsubscribedAt = new Date()
        await subscription.save()

        // Dynamically assign a default plan to the user
        const defaultPlan = await Plan.findOne({
          where: {
            isDefault: true,
            name: Not('guest'),
          },
        })

        if (!defaultPlan) {
          throw new Error('Default plan not found')
        }

        const newUserSubscription = new UserSubscription()
        Object.assign(newUserSubscription, {
          user: subscription.user,
          plan: defaultPlan,
          subscribedAt: new Date(),
          isActive: true,
        })

        await newUserSubscription.save()
      }

      return true
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteUserSubscription(
    @Arg('id', () => ID) id: string,
  ): Promise<boolean> {
    try {
      const subscription = await UserSubscription.findOne({
        where: [{ id }, { isActive: false }],
      })

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      await subscription.remove()
      return true
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }
}
