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
  // List of all users subscriptions: only admin can see all subscriptions
  @Authorized(UserRole.ADMIN)
  @Query(() => [UserSubscription])
  async getAllUsersSubscriptions(): Promise<UserSubscription[]> {
    const subscriptions = await UserSubscription.find({
      relations: ['user', 'plan'],
      order: { subscribedAt: 'DESC' },
    })
    return subscriptions
  }

  // Active subscription for the current user: admin and user can see active subscription
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
    const where = isAdmin ? {} : { user: { id: user.id }, isActive: true }
    const subscription = await UserSubscription.findOne({
      where,
      relations: ['plan'],
      order: { subscribedAt: 'DESC' },
    })

    if (!subscription) {
      throw new Error('No active subscription found')
    }

    return subscription
  }

  // Create a subscription
  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => UserSubscription)
  async subscribe(
    @Arg('data', () => UserSubscriptionCreateInput)
    data: UserSubscriptionCreateInput,
    @Ctx() context: AuthContextType,
  ): Promise<UserSubscription | null> {
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

      // Verify that the user exists
      const user = await User.findOne({ where: { id: data.userId } })
      if (!user) {
        throw new Error('User not found')
      }

      // Verify that the plan exists
      const plan = await Plan.findOne({ where: { id: data.planId } })
      if (!plan) {
        throw new Error('Plan not found')
      }

      // Check if user active subscription and cancel it
      const existingSubscription = await UserSubscription.findOne({
        where: {
          user: { id: data.userId },
          isActive: true,
        },
      })

      if (existingSubscription) {
        await UserSubscription.update(existingSubscription.id, {
          plan: plan,
          unsubscribedAt: new Date(),
          isActive: false,
          expiresAt: new Date(),
        })
      }

      const newSubscription = new UserSubscription()
      Object.assign(newSubscription, {
        plan: plan,
        user: user,
        subscribedAt: new Date(),
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })

      const createdSubscription = await newSubscription.save()
      return createdSubscription
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  // Automatically update a subscription when the use pay for a new/existing subscription
  @Authorized(UserRole.ADMIN)
  @Mutation(() => UserSubscription, { nullable: true })
  async updateUserSubscription(
    @Arg('id', () => ID) id: string,
    @Arg('data', () => UserSubscriptionUpdateInput)
    data: UserSubscriptionUpdateInput,
  ): Promise<UserSubscription | null> {
    try {
      // Not sure we need this, we should be able to update the subscription without the user being authenticated (ex auto payment)
      // const currentUser = await getUserFromContext(context)
      // if (!currentUser) {
      //   throw new Error('User not found')
      // }

      const subscription = await UserSubscription.findOne({
        where: { id },
        relations: ['user'],
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
  async cancelSubscription(
    @Ctx() context: AuthContextType,
    @Arg('id', () => ID, { nullable: true }) id?: string,
  ): Promise<boolean> {
    try {
      const currentUser = await getUserFromContext(context)
      if (!currentUser) {
        throw new Error('User not found')
      }

      let subscription: UserSubscription | null

      if (id) {
        // Admin functionality: cancel a specific subscription by ID
        if (currentUser.role !== UserRole.ADMIN) {
          throw new Error('Only admins can cancel subscriptions by ID')
        }
        
        subscription = await UserSubscription.findOne({
          where: { id },
          relations: ['user'],
        })
        
        if (!subscription) {
          throw new Error('Subscription not found')
        }
      } else {
        // Regular user functionality: cancel their own active subscription
        subscription = await UserSubscription.findOne({
          where: { 
            user: { id: currentUser.id }, 
            isActive: true 
          },
          relations: ['user'],
        })

        if (!subscription) {
          throw new Error('No active subscription found')
        }
      }

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
        user: subscription.user, // Use the subscription's user (could be different if admin is canceling)
        plan: defaultPlan,
        subscribedAt: new Date(),
        isActive: true,
      })

      await newUserSubscription.save()
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
        where: { id },
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
