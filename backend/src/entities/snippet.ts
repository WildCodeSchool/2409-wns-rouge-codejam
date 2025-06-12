import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  BaseEntity,
} from 'typeorm'

import { User } from './user'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import { IsNotEmpty, Length, MaxLength } from 'class-validator'

@Entity()
@ObjectType()
@Unique(['slug'])
// garantit qu’un slug ne peut exister qu’une fois (permettra plus tard de retrouver un snippet par URL)
export class Snippet extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column('varchar', { length: 60 })
  @Field(() => String)
  name!: string

  @Column('text')
  @Field(() => String)
  code!: string

  @Column('varchar', { length: 100 })
  @Field(() => String)
  slug!: string

  @Column('varchar', { length: 20 })
  @Field(() => String)
  language!: string

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => GraphQLDateTime)
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => GraphQLDateTime)
  updatedAt!: Date

  // TODO: Ajouter la relation inverse lorsque User.snippets sera disponible
  @ManyToOne(() => User, { nullable: false })
  //chaque snippet appartient à un user
  @Field(() => User)
  user!: User
}

// Input type for creating a new snippet
@InputType()
export class SnippetCreateInput {
  @Field(() => String)
  @Length(1, 60)
  name!: string

  @Field(() => String)
  @IsNotEmpty()
  code!: string

  @Field(() => String)
  @MaxLength(100)
  slug!: string

  @Field(() => String)
  @Length(1, 20)
  language!: string

  @Field(() => ID)
  userId!: number
}

// Input type for updating an existing snippet
@InputType()
export class SnippetUpdateInput {
  @Field(() => String, { nullable: true })
  @Length(1, 60, { message: 'Name must be between 1 and 60 characters long.' })
  name?: string

  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  @MaxLength(100, { message: 'Slug must be at most 100 characters long.' })
  slug?: string

  @Field(() => String, { nullable: true })
  @Length(1, 20, {
    message: 'Language must be between 1 and 20 characters long.',
  })
  language?: string
}
