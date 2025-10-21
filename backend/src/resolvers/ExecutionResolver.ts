import { Arg, Ctx, ID, Mutation, Resolver } from 'type-graphql'
import { Execution } from '../entities/Execution'
import {
  createCookieWithJwt,
  createGuestUser,
  createSnippet,
  findActiveSubscription,
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
import { GraphQLError } from 'graphql'

@Resolver()
export class ExecutionResolver {
  @Mutation(() => Execution)
  async execute(
    @Ctx() context: ContextType,
    @Arg('data', () => SnippetCreateInput) data: SnippetCreateInput,
    @Arg('snippetId', () => ID, { nullable: true }) snippetId?: string,
  ): Promise<Execution> {
    try {
      let currentUser = await getUserFromContext(context)
      let snippet

      if (!currentUser) {
        const newGuestUser = await createGuestUser()
        // Subscribe user with role guest to the guest free plan
        await subscribeGuest(newGuestUser.id)

        // Create a cookie with a jwt that does not expire (Prevent a guest account from getting an "INVALID_JWT" error)
        createCookieWithJwt(newGuestUser.id, context, null)

        currentUser = newGuestUser
      }

      /* Get user's active subscription to check execution limit
       => we could use redis cache to avoid fetching subscription for each execution */

      const activeSubscription = await findActiveSubscription(currentUser.id)
      if (!activeSubscription) {
        throw new Error('No active subscription found')
      }
      // Get current execution count for the user
      const currentExecutionCount = await getUserExecutionCount(currentUser.id)

      // Check if execution limit is exceeded based on user's plan
      if (
        activeSubscription.plan.executionLimit !== null &&
        currentExecutionCount >= activeSubscription.plan.executionLimit
      ) {
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
      if (err instanceof GraphQLError || err instanceof Error) {
        throw err
      } else {
        throw new Error(JSON.stringify(err))
      }
    }
  }
}
