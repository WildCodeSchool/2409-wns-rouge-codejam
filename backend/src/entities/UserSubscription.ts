import {
  Field,
  InputType,
  ObjectType,
  ID,
  registerEnumType,
} from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'
import { Plan } from './Plan'
import { CancellationReason } from '../types'

registerEnumType(CancellationReason, {
  name: 'CancelationReadon', // mandatory
  description: 'Cancelation possible reason', // optional
})

@Entity()
@ObjectType()
export class UserSubscription extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  // Can not be null as we need to create a subscription when a user is created
  @CreateDateColumn()
  @Field(() => GraphQLDateTime)
  subscribedAt!: Date

  // Is defined when user unsubscribes from a plan
  @Column({ type: 'timestamp', nullable: true })
  @Field(() => GraphQLDateTime, { nullable: true })
  terminatedAt?: Date

  // Is defined when user subscribes to a paid plan
  @Column({ type: 'timestamp', nullable: true })
  @Field(() => GraphQLDateTime, { nullable: true })
  expiresAt?: Date

  @Column({ type: 'enum', enum: CancellationReason, nullable: true })
  @Field(() => CancellationReason)
  cancellationReason!: CancellationReason

  @ManyToOne(() => User, (user) => user.subscriptions, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user!: User

  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  @Field(() => Plan)
  plan!: Plan
}

@InputType()
export class UserSubscriptionCreateInput {
  @Field(() => String, { nullable: true })
  userId!: string

  @Field(() => ID)
  planId!: string
}

@InputType()
export class UserSubscriptionUpdateInput {
  @Field(() => GraphQLDateTime, { nullable: true })
  terminatedAt?: Date

  @Field(() => GraphQLDateTime, { nullable: true })
  expiresAt?: Date

  @Field(() => String, { nullable: true })
  cancellationReason?: CancellationReason
}
