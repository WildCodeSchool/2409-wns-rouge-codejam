import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm'
import slugify from 'slugify'
import { User } from './User'
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import { IsNotEmpty, Length, IsEnum, IsOptional } from 'class-validator'
import { Language } from '../types'
import { Execution } from './Execution'

registerEnumType(Language, {
  name: 'Language',
  description: 'Supported programming languages',
})

export const SNIPPET_NAME_LEN = { min: 1, max: 60 }

@Entity()
@ObjectType()
export class Snippet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  @Column('varchar', { length: SNIPPET_NAME_LEN.max })
  @Field(() => String)
  name!: string

  @Column('text')
  @Field(() => String)
  code!: string

  @Column('text')
  @Field(() => String)
  slug!: string

  @Column({ type: 'enum', enum: Language, default: Language.TYPESCRIPT })
  @Field(() => Language)
  language!: Language

  @CreateDateColumn()
  @Field(() => GraphQLDateTime)
  createdAt!: Date

  @UpdateDateColumn()
  @Field(() => GraphQLDateTime)
  updatedAt!: Date

  @ManyToOne(() => User, (user) => user.snippets, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user!: User

  @OneToMany(() => Execution, (executions) => executions.snippet)
  @Field(() => [Execution], { nullable: true })
  executions!: Execution[]

  @BeforeInsert()
  @BeforeUpdate()
  createSlug() {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
}

// Input type for creating a new snippet
@InputType()
export class SnippetCreateInput {
  @Field(() => String)
  @Length(SNIPPET_NAME_LEN.min, SNIPPET_NAME_LEN.max)
  name!: string

  @Field(() => String)
  code!: string

  @Field(() => Language)
  @IsEnum(Language)
  language!: Language
}

// Input type for updating an existing snippet
@InputType()
export class SnippetUpdateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(SNIPPET_NAME_LEN.min, SNIPPET_NAME_LEN.max)
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  code?: string

  @Field(() => Language, { nullable: true })
  @IsEnum(Language)
  language?: Language
}
