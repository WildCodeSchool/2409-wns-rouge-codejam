import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ExecutionStatus } from '../types'
import { Snippet } from './Snippet'

/**
 * Make TypeGraphQL aware of the enum `ExecutionStatus`.
 *
 * To tell TypeGraphQL about our enum, we would ideally mark the enums with the @EnumType() decorator. However, TypeScript decorators only work with classes, so we need to make TypeGraphQL aware of the enums manually by calling the registerEnumType function and providing the enum name for GraphQL.
 *
 * See: https://typegraphql.com/docs/enums.html
 */
registerEnumType(ExecutionStatus, {
  name: 'ExecutionStatus', // mandatory
  description: 'Execution possible status', // optional
})

/**
 * ----------------------------------------------------------------
 * Execution entity definition.
 * ----------------------------------------------------------------
 */
@Entity()
@ObjectType()
export class Execution extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id!: string

  @Column({ type: 'enum', enum: ExecutionStatus, nullable: true })
  @Field(() => ExecutionStatus)
  status!: ExecutionStatus

  @Column({ type: 'text', nullable: true })
  @Field(() => String)
  result!: string

  @CreateDateColumn()
  @Field(() => GraphQLDateTime)
  executedAt!: Date

  @ManyToOne(() => Snippet, (Snippet) => Snippet.executions, {
    onDelete: 'CASCADE',
  })
  @Field(() => Snippet)
  snippet!: Snippet
}
