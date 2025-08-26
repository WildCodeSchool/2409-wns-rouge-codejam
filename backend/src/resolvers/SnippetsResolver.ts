import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  Authorized,
  Ctx,
  Int,
} from 'type-graphql'
import {
  Snippet,
  SnippetCreateInput,
  SnippetUpdateInput,
} from '../entities/Snippet'
import { AuthContextType, UserRole } from '../types'
import { getUserFromContext } from './utils'

@Resolver()
export class SnippetsResolver {
  // Public route to allow code sharing between users regardless their role
  @Query(() => Snippet, { nullable: true })
  async getSnippet(
    @Ctx() context: AuthContextType,
    @Arg('id', () => ID) id: string,
    @Arg('limit', () => Int, { nullable: true }) limit = 1,
    @Arg('offset', () => Int, { nullable: true }) offset = 0,
  ): Promise<Snippet | null> {
    const currentUser = await getUserFromContext(context)
    const isAdmin = currentUser && currentUser.role === UserRole.ADMIN

    const qb = Snippet.createQueryBuilder('snippet')
      .leftJoinAndSelect('snippet.executions', 'execution')
      .where('snippet.id = :id', { id })
      .orderBy('execution.executedAt', 'DESC')
      .limit(Math.min(limit, 50)) // Cap the limit to 50 to avoid abuse
      .offset(offset)

    if (isAdmin) {
      qb.leftJoinAndSelect('snippet.user', 'user')
    }

    const snippet = await qb.getOne()

    return snippet
  }

  // Query to get all snippets
  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Query(() => [Snippet])
  async getAllSnippets(@Ctx() context: AuthContextType): Promise<Snippet[]> {
    const isAdmin = context.user.role === UserRole.ADMIN
    const where = isAdmin ? {} : { user: { id: context.user.id } }
    const relations = isAdmin ? ['user'] : []
    return Snippet.find({
      where,
      relations,
    })
  }

  // Mutation to create a new snippet
  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => Snippet)
  async createSnippet(
    @Ctx() context: AuthContextType,
    @Arg('data', () => SnippetCreateInput) data: SnippetCreateInput,
  ): Promise<Snippet> {
    const newSnippet = new Snippet()
    Object.assign(newSnippet, data, { user: context.user })

    return await Snippet.save(newSnippet)
  }

  // Mutation to update an existing snippet
  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => Snippet)
  async updateSnippet(
    @Ctx() context: AuthContextType,
    @Arg('id', () => ID) id: string,
    @Arg('data', () => SnippetUpdateInput) data: SnippetUpdateInput,
  ): Promise<Snippet> {
    const snippet = await Snippet.findOne({
      where: { id, user: context.user },
    })
    if (!snippet) throw new Error('Snippet not found or not owned by user')

    Object.assign(snippet, data)

    return await Snippet.save(snippet)
  }

  // Mutation to delete a snippet
  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => Boolean)
  async deleteSnippet(
    @Ctx() context: AuthContextType,
    @Arg('id', () => ID) id: string,
  ): Promise<boolean> {
    const isAdmin = context.user.role === UserRole.ADMIN
    const where = isAdmin ? {} : { user: { id: context.user.id }, id }
    const snippet = await Snippet.findOne({
      where,
    })
    if (!snippet) throw new Error('Snippet not found or not owned by user')

    await Snippet.remove(snippet)
    return !!snippet
  }
}
