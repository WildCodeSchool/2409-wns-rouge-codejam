import { IsEmail, Length } from 'class-validator'
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

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ type: 'varchar', unique: true, length: 32 })
  @Length(2, 32, {
    message: 'The username must be between 2 and 32 characters',
  })
  @Field(() => String, { nullable: true })
  username!: string

  @Column({ type: 'varchar', length: 320, unique: true })
  @IsEmail()
  @Field(() => String)
  email!: string

  // @Column()
  // @IsUrl()
  // @Field(() => String, { nullable: true })
  // picture!: string

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
  @Field(() => String, { nullable: true })
  username!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string

  // @Field(() => String, { nullable: true })
  // picture!: string
}

@InputType()
export class UserUpdateInput {
  @Field(() => String, { nullable: true })
  username!: string

  @Field(() => String, { nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  password!: string

  // @Field(() => String, { nullable: true })
  // picture!: string
}

@InputType()
export class UserFilterInput {
  @Field(() => [Number], { nullable: true })
  ids!: number[]
}
