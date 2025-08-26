import { Length, Min, Max } from 'class-validator'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
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
import { UserSubscription } from './UserSubscription'

const PLAN_NAME_CONSTRAINTS = {
  minLength: 3,
  maxLength: 60,
}

// Price is in cents to avoid floating point arithmetic issues.
const PRICE_CONSTRAINTS = {
  min: 0,
  max: 999999,
}

const EXECUTION_LIMIT_CONSTRAINTS = {
  min: 0,
  max: 999999,
}

@Entity()
@ObjectType()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  @Column({
    type: 'varchar',
    length: PLAN_NAME_CONSTRAINTS.maxLength,
    unique: true,
  })
  @Field(() => String)
  name!: string

  @Column({ type: 'int' })
  @Field(() => Int)
  price!: number

  @Column({ type: 'smallint' })
  @Field(() => Int)
  executionLimit!: number

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isDefault!: boolean

  @CreateDateColumn()
  @Field(() => GraphQLDateTime)
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => GraphQLDateTime)
  updatedAt!: Date

  @OneToMany(() => UserSubscription, (subscription) => subscription.plan)
  @Field(() => [UserSubscription])
  subscriptions!: UserSubscription[]
}

@InputType()
export class PlanCreateInput {
  @Field(() => String)
  @Length(PLAN_NAME_CONSTRAINTS.minLength, PLAN_NAME_CONSTRAINTS.maxLength)
  name!: string

  @Field(() => Int)
  @Min(PRICE_CONSTRAINTS.min)
  @Max(PRICE_CONSTRAINTS.max)
  price!: number

  @Field(() => Int)
  @Min(EXECUTION_LIMIT_CONSTRAINTS.min)
  @Max(EXECUTION_LIMIT_CONSTRAINTS.max)
  executionLimit!: number

  @Field(() => Boolean)
  isDefault?: boolean
}

@InputType()
export class PlanUpdateInput {
  @Field(() => String)
  @Length(PLAN_NAME_CONSTRAINTS.minLength, PLAN_NAME_CONSTRAINTS.maxLength)
  name?: string

  @Field(() => Int)
  @Min(PRICE_CONSTRAINTS.min)
  @Max(PRICE_CONSTRAINTS.max)
  price?: number

  @Field(() => Int)
  @Min(EXECUTION_LIMIT_CONSTRAINTS.min)
  @Max(EXECUTION_LIMIT_CONSTRAINTS.max)
  executionLimit?: number

  @Field(() => Boolean)
  isDefault?: boolean
}
