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
import {
  createCookieWithJwt,
  createGuestUser,
  createSnippet,
  getUserFromContext,
  subscribeGuest,
  updateSnippet,
} from './utils'
import { FindOptionsWhere } from 'typeorm'

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
      order: { createdAt: 'DESC' },
    })
  }

  /**
   * Mutation to save a snippet.
   *
   * It will create a new guest user if user context is null,
   * create a new snippet attached to the user if the snippet is not own by him or
   * if the snippet not exist yet.
   * Otherwise it will update the snippet.
   * @param context the request context
   * @param data the snippet
   * @param id the id of the snippet
   * @returns the created or updated snippet
   */
  @Mutation(() => Snippet, { nullable: true })
  async saveSnippet(
    @Ctx() context: AuthContextType,
    @Arg('data', () => SnippetCreateInput) data: SnippetCreateInput,
    @Arg('id', () => ID, { nullable: true }) id?: string,
  ): Promise<Snippet> {
    let currentUser = await getUserFromContext(context)

    // If user does not exist, create a new guest user
    if (!currentUser) {
      const newGuestUser = await createGuestUser()
      // Subscribe user with role guest to the guest free plan
      await subscribeGuest(newGuestUser.id)
      createCookieWithJwt(newGuestUser.id, context, null)
      currentUser = newGuestUser
    }
    context.user = currentUser

    // If an id is provided, find the associated snippet
    let snippet =
      id &&
      (await Snippet.findOne({
        where: { id },
        relations: ['user'],
      }))

    // If the snippet is null (first time saving a snippet or not able to find an existing one)
    // Or if a snippet exists but not own by the current user, so we have to create a new snippet.
    if (!snippet || snippet.user.id !== currentUser.id) {
      snippet = await createSnippet(data, currentUser)
    } else {
      snippet = await updateSnippet(snippet, data)
    }

    return snippet
  }

  // Mutation to create a new snippet
  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Mutation(() => Snippet)
  async createSnippet(
    @Ctx() context: AuthContextType,
    @Arg('data', () => SnippetCreateInput) data: SnippetCreateInput,
  ): Promise<Snippet> {
    const newSnippet = new Snippet()
    Object.assign(newSnippet, data, { user: { id: context.user.id } })
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
      where: { id, user: { id: context.user.id } },
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
    const where: FindOptionsWhere<Snippet> =
      context.user.role === UserRole.ADMIN
        ? { id }
        : { id, user: { id: context.user.id } }
    const snippet = await Snippet.findOne({
      where,
    })
    if (!snippet) throw new Error('Snippet not found or not owned by user')

    await Snippet.remove(snippet)
    return true
  }
}
