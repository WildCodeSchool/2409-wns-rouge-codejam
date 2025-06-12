import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql'
import {
  Snippet,
  SnippetCreateInput,
  SnippetUpdateInput,
} from '../entities/snippet'
import { validate } from 'class-validator'
import { User } from '../entities/user'
import { validationError } from './utils'

@Resolver()
export class SnippetsResolver {
  @Mutation(() => Snippet, { nullable: true })
  async createSnippet(
    @Arg('data', () => SnippetCreateInput) data: SnippetCreateInput,
  ): Promise<Snippet | null> {
    try {
      const user = await User.findOne({
        where: { id: data.userId },
      })
      if (!user) {
        throw new Error('User not found')
      }
      const newSnippet = new Snippet()
      Object.assign(newSnippet, {
        ...data,
        user,
      })
      const errors = await validate(newSnippet)
      if (errors.length > 0) {
        throw validationError(errors)
      }
      const savedSnippet = await Snippet.save(newSnippet)
      return savedSnippet
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }
  // Mutation to update an existing snippet
  @Mutation(() => Snippet)
  async updateSnippet(
    @Arg('id', () => ID) id: number,
    @Arg('data', () => SnippetUpdateInput) data: SnippetUpdateInput,
  ): Promise<Snippet> {
    const snippet = await Snippet.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!snippet) {
      throw new Error('Snippet not found')
    }
    Object.assign(snippet, data)
    const errors = await validate(snippet)
    if (errors.length > 0) {
      throw validationError(errors)
    }
    const updatedSnippet = await Snippet.save(snippet)
    return updatedSnippet
  }
  // Mutation to delete a snippet
  @Mutation(() => Boolean)
  async deleteSnippet(@Arg('id', () => ID) id: number): Promise<boolean> {
    const snippet = await Snippet.findOne({ where: { id } })
    if (!snippet) {
      throw new Error('Snippet not found')
    }

    await Snippet.remove(snippet)
    return true
  }
  // Query to get snippet by ID
  @Query(() => Snippet, { nullable: true })
  async getSnippet(@Arg('id', () => ID) id: number): Promise<Snippet | null> {
    const snippet = await Snippet.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!snippet) {
      throw new Error('Snippet not found')
    }
    return snippet
  }
  // Query to get all snippets
  @Query(() => [Snippet])
  async getAllSnippets(): Promise<Snippet[]> {
    const snippets = await Snippet.find({
      relations: ['user'],
    })
    return snippets
  }
}
