import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Length } from 'class-validator'
import { ExecutionStatus, Language } from '../types'

const SCRIPT_CONSTRAINTS = {
  minLength: 2,
  maxLength: 10000,
}

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

registerEnumType(Language, {
  name: 'Language', // mandatory
  description: 'Execution possible language', // optional
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

  @Column({ type: 'enum', enum: ExecutionStatus })
  @Field(() => ExecutionStatus)
  status!: ExecutionStatus

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

  @Field(() => Language)
  language!: Language
}
