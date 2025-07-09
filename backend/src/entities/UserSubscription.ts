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
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'


@Entity({ name: 'user_subscription' })
@ObjectType()
export class UserSubscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number

  @Column({ type: 'timestamp', name: 'subscribed_at' })
  @Field(() => GraphQLDateTime)
  subscribedAt!: Date

  @Column({ type: 'timestamp', name: 'unsubscribed_at', nullable: true })
  @Field(() => GraphQLDateTime, { nullable: true })
  unsubscribedAt?: Date

  @Column({ type: 'boolean', name: 'is_active', default: true })
  @Field(() => Boolean)
  isActive!: boolean

  @Column({ type: 'timestamp', name: 'expires_at', nullable: true })
  @Field(() => GraphQLDateTime, { nullable: true })
  expiresAt?: Date

  // Foreign key columns
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string

  @Column({ type: 'int', name: 'plan_id' })
  planId!: number

  // Relations
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user!: User

  @ManyToOne('Plan', 'subscriptions', { eager: true })
  @JoinColumn({ name: 'plan_id' })
  @Field(() => String, { description: 'Plan associated with this subscription' })
  plan!: any
}


@InputType()
export class UserSubscriptionCreateInput {
  @Field(() => String)
  userId!: string

  @Field(() => Int)
  planId!: number

  @Field(() => GraphQLDateTime, { nullable: true })
  subscribedAt?: Date

  @Field(() => GraphQLDateTime, { nullable: true })
  expiresAt?: Date

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean
}

@InputType()
export class UserSubscriptionUpdateInput {
  @Field(() => GraphQLDateTime, { nullable: true })
  unsubscribedAt?: Date

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean

  @Field(() => GraphQLDateTime, { nullable: true })
  expiresAt?: Date
} 