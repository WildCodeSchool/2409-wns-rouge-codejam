import argon2 from 'argon2'
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
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
} from '../entities/user'
import { AuthContextType, ContextType, UserRole } from '../types'
import { getUserFromContext } from './utils'

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
  async user(@Arg('id', () => ID) id: number): Promise<User | null> {
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
      const existingUserByEmail = await User.findOne({
        where: { email: data.email },
      })
      const existingUserByUsername = await User.findOne({
        where: { username: data.username },
      })

      if (existingUserByEmail && existingUserByUsername) {
        throw new Error(
          'A user with this email and this username already exists',
        )
      } else if (existingUserByEmail) {
        throw new Error('A user with this email already exists')
      } else if (existingUserByUsername) {
        throw new Error('A user with username already exists')
      }
      const newUser = new User()
      const hashedPassword = await argon2.hash(data.password)

      Object.assign(newUser, {
        ...data,
        hashedPassword,
        password: null, // remove clear password
      })

      const createdUser = await newUser.save()
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

      if (process.env.NODE_ENV !== 'test') {
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET || '',
          {
            expiresIn: '24h',
          },
        )
        new Cookies(context.req, context.res).set('access_token', token, {
          httpOnly: true,
          secure: false,
        })
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
    @Arg('id', () => ID, { nullable: true }) id?: number,
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
    @Arg('id', () => ID, { nullable: true }) id?: number,
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
