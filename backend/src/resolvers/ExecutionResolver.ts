import { Arg, Ctx, ID, Mutation, Resolver } from 'type-graphql'
import { Execution } from '../entities/Execution'
import {
  createCookieWithJwt,
  createGuestUser,
  createSnippet,
  getFirstSnippet,
  getSnippet,
  getUserExecutionCount,
  getUserFromContext,
  sendCodeToExecute,
  subscribeGuest,
  updateSnippet,
} from './utils'
import { ContextType, UserRole } from '../types'
import { SnippetCreateInput } from '../entities/Snippet'
import { UserSubscription } from '../entities/UserSubscription'
import { IsNull, MoreThan } from 'typeorm'

@Resolver()
export class ExecutionResolver {
  @Mutation(() => Execution, { nullable: true })
  async execute(
    @Ctx() context: ContextType,
    @Arg('data', () => SnippetCreateInput) data: SnippetCreateInput,
    @Arg('snippetId', () => ID, { nullable: true }) snippetId?: string,
  ): Promise<Execution | null> {
    try {
      let currentUser = await getUserFromContext(context)
      let snippet

      if (!currentUser) {
        const newGuestUser = await createGuestUser()
        // Subscribe user with role guest to the guest free plan
        await subscribeGuest(newGuestUser.id)
        createCookieWithJwt(newGuestUser.id, context)

        currentUser = newGuestUser
      }

      /* Get user's active subscription to check execution limit
       => we could use redis cache to avoid fetching subscription for each execution */
      const now = new Date()
      const activeSubscription = await UserSubscription.findOne({
        where: [
          {
            user: { id: currentUser.id },
            expiresAt: MoreThan(now),
          },
          {
            user: { id: currentUser.id },
            plan: { isDefault: true },
            expiresAt: IsNull(),
          },
        ],
        relations: ['plan', 'user'],
        order: { subscribedAt: 'DESC' },
      })

      if (!activeSubscription) {
        throw new Error('No active subscription found')
      }

      // Get current execution count for the user
      const currentExecutionCount = await getUserExecutionCount(currentUser.id)

      // Check if execution limit is exceeded based on user's plan
      if (currentExecutionCount >= activeSubscription.plan.executionLimit) {
        throw new Error('Execution limit exceeded for your current plan')
      }

      /*
        If the user is a guest, then he only has one snippet, 
        so we just need to retrieve the first associated snippet from the database.
        If the user is an authenticated user and a snippetId has been provided, 
        then we can retrieve the associated snippet.
      */
      if (currentUser.role === UserRole.GUEST) {
        snippet = await getFirstSnippet(currentUser.id)
      } else {
        if (snippetId) {
          snippet = await getSnippet(snippetId, currentUser.id)
        }
      }

      // Create a snippet if the execution is not yet associated with an existing one
      if (!snippet) {
        snippet = await createSnippet(data, currentUser)
      } else {
        snippet = await updateSnippet(snippet, data)
      }

      // Create snippet before execution to ensure executions count to be up to date
      // !TODO: change to a SQL transaction
      const newExecution = new Execution()
      Object.assign(newExecution, {
        snippet,
      })
      const execution = await Execution.save(newExecution)

      const executionResponse = await sendCodeToExecute(data)

      Object.assign(execution, {
        ...executionResponse,
        snippet,
      })

      const savedExecution = await Execution.save(execution)
      return savedExecution
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }
}
