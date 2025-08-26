import argon2 from 'argon2'
import Cookies from 'cookies'
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
  User,
  UserCreateInput,
  UserLoginInput,
  UserUpdateInput,
} from '../entities/User'
import {
  AuthContextType,
  CancellationReason,
  ContextType,
  UserRole,
} from '../types'
import { createCookieWithJwt, getUserFromContext } from './utils'
import { UserSubscription } from '../entities/UserSubscription'
import { Plan } from '../entities/Plan'
import { IsNull, LessThanOrEqual, MoreThan, Not } from 'typeorm'

@Resolver()
export class UsersResolver {
  @Authorized(UserRole.ADMIN)
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await User.find()
    return users
  }

  @Authorized(UserRole.ADMIN)
  @Query(() => User, { nullable: true }) // set nullable to true to allow returning null if no user is found, and avoid throwing an error
  async user(@Arg('id', () => ID) id: string): Promise<User | null> {
    const user = await User.findOne({
      where: { id },
    })
    return user
  }

  @Query(() => User, { nullable: true })
  async whoAmI(@Ctx() context: ContextType): Promise<User | null> {
    const me = await getUserFromContext(context)
    return me
  }

  @Mutation(() => User, { nullable: true })
  async createUser(
    @Arg('data', () => UserCreateInput) data: UserCreateInput,
  ): Promise<User | null> {
    try {
      // Verify if user already exists (email and username should both be unique)
      const existingUser = await User.findOne({
        where: [{ email: data.email }, { username: data.username }],
      })

      if (existingUser) {
        if (
          existingUser.email === data.email &&
          existingUser.username === data.username
        ) {
          throw new Error(
            'A user with this email and this username already exists',
          )
        } else if (existingUser.email === data.email) {
          throw new Error('A user with this email already exists')
        } else {
          throw new Error('A user with this username already exists')
        }
      }
      const newUser = new User()
      const hashedPassword = await argon2.hash(data.password)

      Object.assign(newUser, {
        ...data,
        role: UserRole.USER,
        hashedPassword,
        password: null, // remove clear password
      })

      const createdUser = await newUser.save()

      // Assign a default free plan to the user
      const defaultPlan = await Plan.findOne({
        where: {
          isDefault: true,
          name: Not('guest'),
        },
      })
      const newUserSubscription = new UserSubscription()
      Object.assign(newUserSubscription, {
        user: createdUser,
        plan: defaultPlan,
        subscribedAt: new Date(),
      })

      await newUserSubscription.save()

      return createdUser
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('data', () => UserLoginInput) data: UserLoginInput,
    @Ctx() context: ContextType,
  ): Promise<User | null> {
    try {
      if (context.user) throw new Error('Already logged in')

      const user = await User.findOne({
        where: { email: data.email },
      })
      if (!user) return null

      const valid = await argon2.verify(user.hashedPassword, data.password)
      if (!valid) return null

      // Check user active subscription
      const now = new Date()

      // Find the currently active subscription (paid or free)
      const activeSubscription = await UserSubscription.findOne({
        where: [
          { user: { id: user.id }, expiresAt: MoreThan(now) }, // can be null if subscription is inactive
          {
            user: { id: user.id },
            expiresAt: IsNull(),
            plan: { isDefault: true },
          },
        ],
        relations: ['plan', 'user'],
        order: { subscribedAt: 'DESC' },
      })

      // If an active subscription isn't found, check for an expired paid one to trigger a one-time downgrade.
      if (!activeSubscription) {
        const expiredPaidSubscription = await UserSubscription.findOne({
          where: {
            user: { id: user.id },
            expiresAt: LessThanOrEqual(now),
            plan: { isDefault: false },
            cancellationReason: IsNull(), // Find only if it hasn't been marked as expired yet
          },
          relations: ['plan', 'user'],
          order: { subscribedAt: 'DESC' },
        })

        // If an expired paid subscription is found, perform the downgrade
        if (expiredPaidSubscription) {
          const defaultPlan = await Plan.findOne({ where: { isDefault: true } })

          if (defaultPlan) {
            const newUserSubscription = new UserSubscription()
            Object.assign(newUserSubscription, {
              user: user,
              plan: defaultPlan,
            })
            await newUserSubscription.save()

            expiredPaidSubscription.cancellationReason =
              CancellationReason.EXPIRED
            expiredPaidSubscription.terminatedAt = now
            await expiredPaidSubscription.save()
          }
        }
      }

      if (process.env.NODE_ENV !== 'test') {
        createCookieWithJwt(user.id, context)
      }
      return user
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: AuthContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res)
    cookies.set('access_token', '', { maxAge: 0 })
    return true
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => User, { nullable: true }) // set nullable to true to allow returning null if no user is found, and avoid throwing an error
  async updateUser(
    @Ctx() context: AuthContextType,
    @Arg('data', () => UserUpdateInput) data: UserUpdateInput,
    @Arg('id', () => ID, { nullable: true }) id?: string,
  ): Promise<User | null> {
    const isAdmin = context.user.role === UserRole.ADMIN
    if (isAdmin && !id) {
      throw new Error('You must provide a user ID to update a user')
    }
    // If the user is not an admin, only the authenticated user itself can update its own account
    const user = await User.findOne({
      where: isAdmin ? { id } : { id: context.user.id },
    })
    if (!user) return null

    Object.assign(user, data)
    const updatedUser = await user.save()
    return updatedUser
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => Boolean)
  async deleteUser(
    @Ctx() context: AuthContextType,
    @Arg('id', () => ID, { nullable: true }) id?: string,
  ): Promise<boolean> {
    const isAdmin = context.user.role === UserRole.ADMIN
    if (isAdmin && !id) {
      throw new Error('You must provide a user ID to delete a user')
    }
    // If the user is not an admin, only the authenticated user itself can delete its own account
    const user = await User.findOne({
      where: isAdmin ? { id } : { id: context.user.id },
    })
    if (!user) return false

    const deletedUser = await user.remove()
    return !!deletedUser
  }
}
