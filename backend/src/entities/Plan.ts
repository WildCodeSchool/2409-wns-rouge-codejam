import { Length, Min, Max } from 'class-validator'
import {
  Field,
  InputType,
  ObjectType,
  Int,
} from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
const PLAN_NAME_CONSTRAINTS = {
  minLength: 1,
  maxLength: 60,
}

const PRICE_CONSTRAINTS = {
  min: 0,
  max: 999999,
}

const EXECUTION_LIMIT_CONSTRAINTS = {
  min: 0,
  max: 32767, // SMALLINT max value
}

@Entity()
@ObjectType()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number

  @Column({
    type: 'varchar',
    length: PLAN_NAME_CONSTRAINTS.maxLength,
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

  // Relations
  @OneToMany('UserSubscription', 'plan')
  @Field(() => [String], { description: 'Subscriptions associated with this plan', nullable: true })
  subscriptions!: any[]
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

  @Field(() => Boolean, { nullable: true })
  isDefault?: boolean
}

@InputType()
export class PlanUpdateInput {
  @Field(() => String, { nullable: true })
  @Length(PLAN_NAME_CONSTRAINTS.minLength, PLAN_NAME_CONSTRAINTS.maxLength)
  name?: string

  @Field(() => Int, { nullable: true })
  @Min(PRICE_CONSTRAINTS.min)
  @Max(PRICE_CONSTRAINTS.max)
  price?: number

  @Field(() => Int, { nullable: true })
  @Min(EXECUTION_LIMIT_CONSTRAINTS.min)
  @Max(EXECUTION_LIMIT_CONSTRAINTS.max)
  executionLimit?: number

  @Field(() => Boolean, { nullable: true })
  isDefault?: boolean
}
