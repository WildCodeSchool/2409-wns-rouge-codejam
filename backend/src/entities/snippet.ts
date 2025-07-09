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
  Not,
} from 'typeorm'

import slugify from 'slugify'

import { User } from './user'
//TODO : import { Language } from '../types'
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  IsNotEmpty,
  Length,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator'

export enum Language {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
}

registerEnumType(Language, {
  name: 'Language',
  description: 'Supported programming languages',
})

export const SNIPPET_NAME_LEN = { min: 1, max: 60 }
export const SNIPPET_SLUG_LEN = 100

@Entity()
@ObjectType()
export class Snippet extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column('varchar', { length: SNIPPET_NAME_LEN.max })
  @Field(() => String)
  name!: string

  @Column('text')
  @Field(() => String)
  code!: string

  @Column('varchar', { length: SNIPPET_SLUG_LEN, unique: true })
  @Field(() => String)
  @MaxLength(SNIPPET_SLUG_LEN)
  slug!: string

  @Column({ type: 'enum', enum: Language, default: Language.TYPESCRIPT })
  @Field(() => Language)
  language!: string

  @CreateDateColumn()
  @Field(() => GraphQLDateTime)
  createdAt!: Date

  @UpdateDateColumn()
  @Field(() => GraphQLDateTime)
  updatedAt!: Date

  @ManyToOne(() => User)
  @Field(() => User)
  user!: User

  @BeforeInsert()
  @BeforeUpdate()
  async ensureUniqueSlug() {
    // slug base
    const base = slugify(this.name, { lower: true, strict: true })
    let candidate = base
    let i = 1

    // whil slug exists, increment the candidate
    while (
      await Snippet.findOne({
        where: {
          slug: candidate,
          id: this.id ? Not(this.id) : undefined, // exclude current snippet if updating
        },
      })
    ) {
      candidate = `${base}-${i++}`
    }

    this.slug = candidate
  }
}

// Input type for creating a new snippet
@InputType()
export class SnippetCreateInput {
  @Field(() => String)
  @Length(SNIPPET_NAME_LEN.min, SNIPPET_NAME_LEN.max)
  name!: string

  @Field(() => String)
  @IsNotEmpty()
  code!: string

  @Field(() => String)
  @IsEnum(Language)
  language!: Language

  @Field(() => ID)
  userId!: number
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
