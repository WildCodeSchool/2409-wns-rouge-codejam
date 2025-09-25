import { IsEmail, Length, IsStrongPassword, MaxLength } from 'class-validator'
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
  UseMiddleware,
} from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsUser } from '../middlewares/isUser'
import { UserRole } from '../types'
import { Snippet } from './Snippet'
import { UserSubscription } from './UserSubscription'

const USERNAME_CONSTRAINTS = {
  minLength: 2,
  maxLength: 32,
}

const EMAIL_CONSTRAINTS = {
  maxLength: 320,
}

const PASSWORD_CONSTRAINTS = {
  minLength: 12,
  maxLength: 40,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
}

/**
 * Make TypeGraphQL aware of the enum `UserRole`.
 *
 * To tell TypeGraphQL about our enum, we would ideally mark the enums with the @EnumType() decorator. However, TypeScript decorators only work with classes, so we need to make TypeGraphQL aware of the enums manually by calling the registerEnumType function and providing the enum name for GraphQ.
 *
 * See: https://typegraphql.com/docs/enums.html
 */
registerEnumType(UserRole, {
  name: 'UserRole', // mandatory
  description: 'User possible roles', // optional
})

/**
 * ----------------------------------------------------------------
 * User entity definition.
 * ----------------------------------------------------------------
 */
@Entity()
@ObjectType()
export class User extends BaseEntity {
  // Create a primary column with an automatically generated uuid to make it less predictable.
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  // We need to set this field nullable to create a guest
  @Column({
    type: 'varchar',
    unique: true,
    length: USERNAME_CONSTRAINTS.maxLength,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  username!: string

  // We need to set this field nullable to create a guest
  @Column({
    type: 'varchar',
    length: EMAIL_CONSTRAINTS.maxLength,
    unique: true,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  // Restrict field access via a middleware. This field should only be accessible to admins or self user.
  @UseMiddleware(IsUser)
  email!: string

  // We need to set this field nullable to create a guest
  @Column({ type: 'varchar', length: 150, nullable: true })
  // This field must not be exposed in GraphQL schema! (no @Field decorator)
  hashedPassword!: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  @Field(() => UserRole)
  role!: UserRole

  @CreateDateColumn()
  @Field(() => GraphQLDateTime)
  createdAt!: Date

  @UpdateDateColumn()
  @Field(() => GraphQLDateTime)
  updatedAt!: Date

  @OneToMany(() => Snippet, (snippet) => snippet.user)
  @Field(() => [Snippet])
  snippets!: Snippet[]

  @OneToMany(() => UserSubscription, (subscription) => subscription.user)
  @Field(() => [UserSubscription])
  subscriptions!: UserSubscription[]
}

/**
 * ----------------------------------------------------------------
 * Input types for user operations.
 * Backend data validation is performed via `class-validator`.
 * ----------------------------------------------------------------
 */
@InputType()
export class UserCreateInput {
  @Field(() => String)
  @Length(USERNAME_CONSTRAINTS.minLength, USERNAME_CONSTRAINTS.maxLength)
  username!: string

  @Field(() => String)
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(EMAIL_CONSTRAINTS.maxLength)
  email!: string

  @Field(() => String)
  @IsStrongPassword(PASSWORD_CONSTRAINTS, {
    message: `Please make sure your password meet the strength requirements: between ${PASSWORD_CONSTRAINTS.minLength.toString()} and ${PASSWORD_CONSTRAINTS.maxLength.toString()} long, including at least ${PASSWORD_CONSTRAINTS.minLowercase.toString()} lowercase letter, ${PASSWORD_CONSTRAINTS.minUppercase.toString()} uppercase letter, ${PASSWORD_CONSTRAINTS.minNumbers.toString()} number, and ${PASSWORD_CONSTRAINTS.minSymbols.toString()} symbol.`,
  })
  password!: string
}

@InputType()
export class UserLoginInput {
  @Field(() => String)
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(EMAIL_CONSTRAINTS.maxLength)
  email!: string

  @Field(() => String)
  password!: string
}

@InputType()
export class UserUpdateInput {
  @Field(() => String, { nullable: true })
  @Length(USERNAME_CONSTRAINTS.minLength, USERNAME_CONSTRAINTS.maxLength)
  username!: string

  @Field(() => String, { nullable: true })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string

  @Field(() => String, { nullable: true })
  @IsStrongPassword(PASSWORD_CONSTRAINTS, {
    message: `Please make sure your password meet the strength requirements: between ${PASSWORD_CONSTRAINTS.minLength.toString()} and ${PASSWORD_CONSTRAINTS.maxLength.toString()} long, including at least ${PASSWORD_CONSTRAINTS.minLowercase.toString()} lowercase letter, ${PASSWORD_CONSTRAINTS.minUppercase.toString()} uppercase letter, ${PASSWORD_CONSTRAINTS.minNumbers.toString()} number, and ${PASSWORD_CONSTRAINTS.minSymbols.toString()} symbol.`,
  })
  password!: string
}
