import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum ExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

@Entity()
@ObjectType()
export class Execution extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ type: 'enum', enum: ExecutionStatus })
  @Field(() => String)
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
  @Field(() => String)
  script!: string

  @Field(() => String)
  language!: string

  // @Field(() => ID)
  // snippetId!: number
}
