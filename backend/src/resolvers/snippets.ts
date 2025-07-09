import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql'
import {
  Snippet,
  SnippetCreateInput,
  SnippetUpdateInput,
} from '../entities/snippet'
import { User } from '../entities/user'

@Resolver()
export class SnippetsResolver {
  // Mutation to create a new snippet
  @Mutation(() => Snippet, { nullable: true })
  async createSnippet(
    @Arg('data', () => SnippetCreateInput) data: SnippetCreateInput,
  ): Promise<Snippet | null> {
    const user = await User.findOne({ where: { id: data.userId } })
    if (!user) throw new Error('User not found')

    const newSnippet = new Snippet()
    Object.assign(newSnippet, { ...data, user })

    return await Snippet.save(newSnippet)
  }

  // Mutation to update an existing snippet
  @Mutation(() => Snippet, { nullable: true })
  async updateSnippet(
    @Arg('id', () => ID) id: number,
    @Arg('data', () => SnippetUpdateInput) data: SnippetUpdateInput,
  ): Promise<Snippet | null> {
    const snippet = await Snippet.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!snippet) return null

    Object.assign(snippet, data)

    return await Snippet.save(snippet)
  }

  // Mutation to delete a snippet
  @Mutation(() => Boolean)
  async deleteSnippet(@Arg('id', () => ID) id: number): Promise<boolean> {
    const snippet = await Snippet.findOne({ where: { id } })
    if (!snippet) return false
    await Snippet.remove(snippet)
    return true
  }
  // Query to get snippet by ID
  @Query(() => Snippet, { nullable: true })
  async getSnippet(@Arg('id', () => ID) id: number): Promise<Snippet | null> {
    return Snippet.findOne({ where: { id }, relations: ['user'] })
  }
  // Query to get all snippets
  @Query(() => [Snippet])
  async getAllSnippets(): Promise<Snippet[]> {
    return Snippet.find({ relations: ['user'] })
  }
}
