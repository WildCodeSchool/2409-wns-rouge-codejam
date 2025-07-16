import { Field, InputType, ObjectType, ID } from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'
import { Plan } from './Plan'

@Entity()
@ObjectType()
export class UserSubscription extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  // Can not be null as we need to create a subscription when a user is created
  @Column({ type: 'timestamp' })
  @Field(() => GraphQLDateTime)
  subscribedAt!: Date

  // Is defined when user unsubscribes from a plan
  @Column({ type: 'timestamp', nullable: true })
  @Field(() => GraphQLDateTime, { nullable: true })
  unsubscribedAt?: Date

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive!: boolean

  // Is defined when user subscribes to a paid plan
  @Column({ type: 'timestamp', nullable: true })
  @Field(() => GraphQLDateTime, { nullable: true })
  expiresAt?: Date

  @ManyToOne(() => User, (user) => user.subscriptions)
  @Field(() => User)
  user!: User

  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  @Field(() => Plan)
  plan!: Plan
}

@InputType()
export class UserSubscriptionCreateInput {
  @Field(() => String)
  userId!: string

  @Field(() => ID)
  planId!: string
}

@InputType()
export class UserSubscriptionUpdateInput {
  @Field(() => ID)
  id!: string

  @Field(() => GraphQLDateTime, { nullable: true })
  expiresAt?: Date
}
