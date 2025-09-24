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
import { findActiveSubscription } from './utils'

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

  /* 
  Only connected admin and user (owns subscription) can see active subscription.
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

    const activeSubscription = await findActiveSubscription(targetUserId)
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

      let user: User | null = currentUser
      if (isAdmin && data.userId) {
        targetUserId = data.userId
        user = await User.findOne({ where: { id: targetUserId } })
      } else if (!isAdmin && data.userId) {
        // Prevent a non-admin from querying another user's subscription
        throw new Error('Unauthorized')
      }
      const now = new Date()

      const plan = await Plan.findOne({ where: { id: data.planId } })

      // Verify if user has already an active premium subscription
      const activeSubscription = await this.getActiveSubscription(
        context,
        targetUserId,
      )

      if (!user) {
        throw new Error('User not found admin')
      }

      if (!plan) {
        throw new Error('Plan not found')
      }

      if (activeSubscription?.plan.price === 0 && plan.price > 0) {
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
      }
      return null
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  // Automatically update a subscription when a user pays for an existing subscription
  @Authorized(UserRole.ADMIN)
  @Mutation(() => UserSubscription, { nullable: true })
  async updateUserSubscription(
    @Ctx() context: AuthContextType,
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
      const subscription = await this.getActiveSubscription(context, user.id)

      // Handle the case where no active subscription is found
      if (!subscription) {
        throw new Error('Active subscription not found for this user.')
      }

      const premiumSubscription = subscription?.plan.price > 0

      // Update the subscription with the provided data
      if (subscription && premiumSubscription) {
        if (data.expiresAt) {
          subscription.expiresAt = data.expiresAt
        }
        if (data.terminatedAt) {
          subscription.terminatedAt = data.terminatedAt
        }
        if (data.cancellationReason) {
          subscription.cancellationReason = data.cancellationReason
        }
        const updatedPremiumSubscription = await subscription.save()
        return updatedPremiumSubscription
      }

      subscription.terminatedAt = new Date()
      subscription.cancellationReason = CancellationReason.SUBSCRIBED
      const updatedFreeSubscription = await subscription.save()

      return updatedFreeSubscription
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
      const targetUserId =
        currentUser.role === UserRole.ADMIN ? userId : currentUser.id
      // Find the currently active subscription
      const activeSubscription = await this.getActiveSubscription(
        context,
        targetUserId,
      )

      if (!activeSubscription) {
        throw new Error('No active subscription found to unsubscribe from.')
      }

      const premiumSubscription = activeSubscription.plan.price > 0

      // If user active plan is a premium and it's not yet terminated he can cancel
      if (premiumSubscription && !activeSubscription.terminatedAt) {
        activeSubscription.terminatedAt = new Date()
        const cancellationReason =
          currentUser.role === UserRole.ADMIN
            ? CancellationReason.CANCELEDADMIN
            : CancellationReason.CANCELLED
        activeSubscription.cancellationReason = cancellationReason

        await activeSubscription.save()
        return true
      }
      return false
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }
}
