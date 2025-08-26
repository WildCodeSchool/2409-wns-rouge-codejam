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
import { AuthContextType, CancellationReason, UserRole } from '../types'
import { IsNull, MoreThan, Not } from 'typeorm'

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

  /* Only connected admin and user (owns subscription) can see active subscription.
    If active subscription is a premium one subscribe button should be desabled or hidden 
  */
  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Query(() => UserSubscription, { nullable: true })
  async getActiveSubscription(
    @Ctx() context: AuthContextType,
    @Arg('userId', () => String, { nullable: true }) userId: string | null,
  ): Promise<UserSubscription | null> {
    const currentUser = context.user

    const isAdmin = currentUser.role === UserRole.ADMIN
    let targetUserId = currentUser.id

    if (isAdmin && userId) {
      targetUserId = userId
    } else if (!isAdmin && userId && userId !== currentUser.id) {
      // Prevent a non-admin from querying another user's subscription
      throw new Error('Unauthorized')
    }

    // A subscription is active if:
    // - it's not terminated
    // - AND it's either a free plan and experation date is Null OR a paid plan with an `expiresAt` > now
    const now = new Date()

    // Try to find an active paid subscription first
    let activeSubscription = await UserSubscription.findOne({
      where: {
        user: { id: targetUserId },
        expiresAt: MoreThan(now),
      },
      relations: ['plan', 'user'],
    })

    // If no active paid subscription is found, check for an active free one
    if (!activeSubscription) {
      activeSubscription = await UserSubscription.findOne({
        where: {
          user: { id: targetUserId },
          terminatedAt: IsNull(),
          expiresAt: IsNull(),
        },
        relations: ['plan', 'user'],
      })
    }

    return activeSubscription
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => UserSubscription)
  async subscribe(
    @Arg('data', () => UserSubscriptionCreateInput)
    data: UserSubscriptionCreateInput,
    @Ctx() context: AuthContextType,
  ): Promise<UserSubscription | null> {
    try {
      const currentUser = context.user
      if (!currentUser) {
        throw new Error('User not found')
      }

      const isAdmin = currentUser.role === UserRole.ADMIN
      let targetUserId = currentUser.id

      if (isAdmin && data.userId) {
        targetUserId = data.userId
      } else if (!isAdmin && data.userId && data.userId !== currentUser.id) {
        // Prevent a non-admin from querying another user's subscription
        throw new Error('Unauthorized')
      }
      const now = new Date()

      // Verify that user and plan exist
      const [user, plan] = await Promise.all([
        User.findOne({ where: { id: targetUserId } }),
        Plan.findOne({ where: { id: data.planId } }),
      ])

      // Verify if user has already an active premium subscription
      const activeSubscription = await this.getActiveSubscription(
        context,
        targetUserId,
      )

      if (!user) {
        throw new Error('User not found')
      }

      if (!plan) {
        throw new Error('Plan not found')
      }

      if (activeSubscription?.plan.isDefault && !plan.isDefault) {
        const newSubscription = new UserSubscription()
        Object.assign(newSubscription, {
          plan: plan,
          user: user,
          subscribedAt: now,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Paid plan: 30 days
        })

        const createdSubscription = await newSubscription.save()
        activeSubscription.cancellationReason = CancellationReason.SUBSCRIBED
        activeSubscription.terminatedAt = now
        await activeSubscription.save()
        return createdSubscription
      } else if (
        !activeSubscription?.plan.isDefault &&
        activeSubscription?.expiresAt &&
        activeSubscription?.expiresAt > now &&
        plan.isDefault
      ) {
        const newSubscription = new UserSubscription()
        Object.assign(newSubscription, {
          plan: plan,
          user: user,
          subscribedAt: now,
        })

        const createdSubscription = await newSubscription.save()
        const cancellationReason = isAdmin
          ? CancellationReason.CANCELEDADMIN
          : CancellationReason.CANCELLED
        activeSubscription.cancellationReason = cancellationReason
        activeSubscription.terminatedAt = now
        await activeSubscription.save()

        return createdSubscription
      }
      return activeSubscription
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  // Automatically update a subscription when a user pays for an existing subscription
  @Authorized(UserRole.ADMIN)
  @Mutation(() => UserSubscription, { nullable: true })
  async updateUserSubscription(
    @Arg('data', () => UserSubscriptionUpdateInput)
    data: UserSubscriptionUpdateInput,
    @Arg('email', () => String) email: string,
  ): Promise<UserSubscription> {
    try {
      // Find the user by their email
      const user = await User.findOne({
        where: { email },
      })

      if (!user) {
        throw new Error('User not found.')
      }

      // Find the user's active premium subscription
      const subscription = await UserSubscription.findOne({
        where: {
          user: { id: user.id },
          expiresAt: MoreThan(new Date()),
        },
        relations: ['user', 'plan'],
      })

      // Handle the case where no active subscription is found
      if (!subscription) {
        throw new Error('Active subscription not found for this user.')
      }

      // Update the subscription with the provided data
      if (data.expiresAt) {
        subscription.expiresAt = data.expiresAt
      }
      if (data.terminatedAt) {
        subscription.terminatedAt = data.terminatedAt
      }
      if (data.cancellationReason) {
        subscription.cancellationReason = data.cancellationReason
      }

      // Save the updated subscription
      const updatedSubscription = await subscription.save()

      return updatedSubscription
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred on user subscription update.',
      )
    }
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => Boolean)
  async unsubscribe(
    @Ctx() context: AuthContextType,
    @Arg('userId', () => ID) userId: string,
  ): Promise<boolean> {
    try {
      const currentUser = context.user

      const isAdmin = currentUser.role === UserRole.ADMIN
      let targetUserId = currentUser.id

      if (isAdmin && userId) {
        targetUserId = userId
      }

      // Find the currently active subscription
      const activeSubscription = await this.getActiveSubscription(
        context,
        targetUserId,
      )

      if (!activeSubscription) {
        throw new Error('No active subscription found to unsubscribe from.')
      }

      const isPaidPlan = activeSubscription.plan.price > 0
      const isPaidPlanExpired =
        activeSubscription.expiresAt &&
        new Date() > activeSubscription.expiresAt

      const cancellationReason = isAdmin
        ? CancellationReason.CANCELEDADMIN
        : isPaidPlanExpired
          ? CancellationReason.EXPIRED
          : CancellationReason.CANCELLED

      if (isPaidPlan) {
        activeSubscription.terminatedAt = new Date()
        activeSubscription.cancellationReason = cancellationReason
        await activeSubscription.save()

        // Assign a default plan to the user
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
          user: activeSubscription.user,
          plan: defaultPlan,
          subscribedAt: new Date(),
        })

        await newUserSubscription.save()
        return true
      }
      return false
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }
}
