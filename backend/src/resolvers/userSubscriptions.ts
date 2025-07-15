import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'

import {
  UserSubscription,
  UserSubscriptionCreateInput,
  UserSubscriptionUpdateInput,
} from '../entities/UserSubscription'
import { Plan } from '../entities/Plan'
import { User } from '../entities/User'
import { AuthContextType, UserRole } from '../types'
import { getUserFromContext } from './utils'

@Resolver(UserSubscription)
export class UserSubscriptionsResolver {
  @Authorized(UserRole.ADMIN)
  @Query(() => [UserSubscription])
  async userSubscriptions(): Promise<UserSubscription[]> {
    const subscriptions = await UserSubscription.find({
      relations: ['user', 'plan'],
      order: { subscribedAt: 'DESC' },
    })
    return subscriptions
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Query(() => [UserSubscription])
  async mySubscriptions(@Ctx() context: AuthContextType): Promise<UserSubscription[]> {
    const user = await getUserFromContext(context)
    if (!user) {
      throw new Error('User not found')
    }

    const subscriptions = await UserSubscription.find({
      where: { user: { id: user.id } },
      relations: ['plan'],
      order: { subscribedAt: 'DESC' },
    })
    return subscriptions
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Query(() => UserSubscription, { nullable: true })
  async activeSubscription(@Ctx() context: AuthContextType): Promise<UserSubscription | null> {
    const user = await getUserFromContext(context)
    if (!user) {
      throw new Error('User not found')
    }

    const subscription = await UserSubscription.findOne({
      where: { 
        user: { id: user.id }, 
        isActive: true 
      },
      relations: ['plan'],
      order: { subscribedAt: 'DESC' },
    })
    return subscription
  }

  @Authorized(UserRole.ADMIN)
  @Query(() => UserSubscription, { nullable: true })
  async userSubscription(@Arg('id', () => ID) id: string): Promise<UserSubscription | null> {
    const subscription = await UserSubscription.findOne({
      where: { id },
      relations: ['user', 'plan'],
    })
    return subscription
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => UserSubscription, { nullable: true })
  async createUserSubscription(
    @Arg('data', () => UserSubscriptionCreateInput) data: UserSubscriptionCreateInput,
    @Ctx() context: AuthContextType,
  ): Promise<UserSubscription | null> {
    try {
      const currentUser = await getUserFromContext(context)
      if (!currentUser) {
        throw new Error('User not found')
      }

      // If not admin, user can only create subscriptions for themselves
      if (currentUser.role !== UserRole.ADMIN && data.userId !== currentUser.id) {
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

      // Check if user already has an active subscription
      const existingSubscription = await UserSubscription.findOne({
        where: { 
          user: { id: data.userId }, 
          isActive: true 
        },
      })

      if (existingSubscription) {
        throw new Error('User already has an active subscription')
      }

      const newSubscription = new UserSubscription()
      Object.assign(newSubscription, {
        ...data,
        subscribedAt: data.subscribedAt || new Date(),
        isActive: data.isActive !== undefined ? data.isActive : true,
      })

      const createdSubscription = await newSubscription.save()
      
      // Load relations for return
      const subscriptionWithRelations = await UserSubscription.findOne({
        where: { id: createdSubscription.id },
        relations: ['user', 'plan'],
      })
      
      return subscriptionWithRelations
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => UserSubscription, { nullable: true })
  async updateUserSubscription(
    @Arg('id', () => ID) id: string,
    @Arg('data', () => UserSubscriptionUpdateInput) data: UserSubscriptionUpdateInput,
    @Ctx() context: AuthContextType,
  ): Promise<UserSubscription | null> {
    try {
      const currentUser = await getUserFromContext(context)
      if (!currentUser) {
        throw new Error('User not found')
      }

      const subscription = await UserSubscription.findOne({
        where: { id },
        relations: ['user'],
      })
      
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      // If not admin, user can only update their own subscriptions
      if (currentUser.role !== UserRole.ADMIN && subscription.user.id !== currentUser.id) {
        throw new Error('You can only update your own subscriptions')
      }

      Object.assign(subscription, data)
      const updatedSubscription = await subscription.save()
      
      // Load relations for return
      const subscriptionWithRelations = await UserSubscription.findOne({
        where: { id: updatedSubscription.id },
        relations: ['user', 'plan'],
      })
      
      return subscriptionWithRelations
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => Boolean)
  async cancelSubscription(
    @Arg('id', () => ID) id: string,
    @Ctx() context: AuthContextType,
  ): Promise<boolean> {
    try {
      const currentUser = await getUserFromContext(context)
      if (!currentUser) {
        throw new Error('User not found')
      }

      const subscription = await UserSubscription.findOne({
        where: { id },
      })
      
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      // If not admin, user can only cancel their own subscriptions
      if (currentUser.role !== UserRole.ADMIN && subscription.user.id !== currentUser.id) {
        throw new Error('You can only cancel your own subscriptions')
      }

      subscription.isActive = false
      subscription.unsubscribedAt = new Date()
      await subscription.save()
      
      return true
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteUserSubscription(@Arg('id', () => ID) id: string): Promise<boolean> {
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