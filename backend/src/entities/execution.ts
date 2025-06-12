import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ExecutionStatus } from '../resolvers/types'
import { Length } from 'class-validator'

const SCRIPT_CONSTRAINTS = {
  minLength: 2,
  maxLength: 10000,
}

@Entity()
@ObjectType()
export class Execution extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ type: 'enum', enum: ExecutionStatus })
  @Field(() => ExecutionStatus)
  status!: string

  @Column({ type: 'text' })
  @Field(() => String)
  result!: string

  @CreateDateColumn()
  @Field(() => GraphQLDateTime)
  executedAt!: Date

  // @ManyToOne(() => Snippet, (Snippet) => Snippet.executions)
  // @Field(() => Snippet)
  // snippet!: Snippet
}

@InputType()
export class ExecutionCreateInput {
  @Length(SCRIPT_CONSTRAINTS.minLength, SCRIPT_CONSTRAINTS.maxLength)
  @Field(() => String)
  script!: string

  @Field(() => String)
  language!: string
}
