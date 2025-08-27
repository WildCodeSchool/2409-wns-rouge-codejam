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
  updateSnippet,
} from './utils'
import { ContextType, UserRole } from '../types'
import { SnippetCreateInput } from '../entities/Snippet'

const EXECUTION_LIMIT = 50

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
        createCookieWithJwt(newGuestUser.id, context)

        currentUser = newGuestUser
      } else {
        // If user exist, check if the execution number related to the user is less than 50 for this day
        const currentExecutionCount = await getUserExecutionCount(
          currentUser.id,
        )

        if (currentExecutionCount >= EXECUTION_LIMIT) {
          throw new Error('Execution limit exceeded')
        }
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
