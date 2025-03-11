import { IsEmail, Length, IsStrongPassword, MaxLength } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

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

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ type: 'varchar', unique: true, length: USERNAME_CONSTRAINTS.maxLength })
  @Field(() => String, { nullable: true })
  username!: string

  @Column({ type: 'varchar', length: EMAIL_CONSTRAINTS.maxLength, unique: true })
  @Field(() => String)
  email!: string

  @Column({ type: 'varchar', length: 150 })
  @Field(() => String)
  hashedPassword!: string

  @CreateDateColumn()
  @Field(() => GraphQLDateTime)
  createdAt!: Date

  @UpdateDateColumn()
  @Field(() => GraphQLDateTime)
  updatedAt!: Date
}

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
export class UserUpdateInput {
  @Field(() => String, { nullable: true })
  username!: string

  @Field(() => String, { nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  password!: string
}

@InputType()
export class UserFilterInput {
  @Field(() => [Number], { nullable: true })
  ids!: number[]
}