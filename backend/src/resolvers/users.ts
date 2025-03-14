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
import { validate } from 'class-validator'
import { getUserFromContext, validationError } from './utils'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import Cookies from 'cookies'
import { AuthContextType, ContextType } from '../auth/custom-auth-checker'

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg('data', () => UserCreateInput) data: UserCreateInput,
  ): Promise<User> {
    const newUser = new User()
    try {
      const hashedPassword = await argon2.hash(data.password)
      Object.assign(newUser, {
        ...data,
        hashedPassword,
        password: null, // remove clear password
      })
    } catch (err) {
      throw new Error((err as Error).message)
    }
    await User.save(newUser)
    const user = await User.findOne({
      where: { id: newUser.id },
    })
    if (!user) throw new Error('The given user does not exist')
    return user
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await User.find()
    return users
  }

  @Query(() => User)
  async user(@Arg('id', () => ID) id: number): Promise<User> {
    const user = await User.findOne({ where: { id } })
    if (!user) throw new Error('The given user does not exist')
    return user
  }

  @Query(() => User, { nullable: true })
  async whoAmI(@Ctx() context: ContextType): Promise<User | null> {
    const user = await getUserFromContext(context)
    return user
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Ctx() context: ContextType,
    @Arg('data', () => UserLoginInput) data: UserLoginInput,
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

  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() context: AuthContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res)
    cookies.set('access_token', '', { maxAge: 0 })
    return true
  }

  @Authorized()
  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => ID) id: number,
    @Arg('data', () => UserUpdateInput) _: UserUpdateInput,
  ): Promise<User> {
    const user = await User.findOne({
      where: { id },
    })
    if (!user) throw new Error('The given user does not exist')

    const errors = await validate(user)
    if (errors.length) throw validationError(errors)

    const updatedUser = await User.save(user)
    return updatedUser
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => ID) id: number): Promise<boolean> {
    const user = await User.findOne({
      where: {
        id,
      },
    })
    if (!user) throw new Error('The given user does not exist')

    const result = await User.remove(user)
    return result ? true : false
  }
}
