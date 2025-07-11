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
  lockUser,
  sendCodeToExecute,
  unlockUser,
  updateSnippet,
} from './utils'
import { ContextType, UserRole } from '../types'
import { SnippetCreateInput } from '../entities/Snippet'

const EXECUTION_LIMIT = 50

@Resolver()
export class ExecutionResolver {
  @Mutation(() => Execution, { nullable: true })
  async execute(
    @Ctx() context: ContextType,
    @Arg('data', () => SnippetCreateInput) data: SnippetCreateInput,
    @Arg('snippetId', () => ID, { nullable: true }) snippetId?: string,
  ): Promise<Execution | null> {
    try {
      // !TODO: Changer l'ordre d'execution des requêtes... Et enlever le champs isLocked dans la table User

      let currentUser = await getUserFromContext(context)

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

      if (currentUser.isLocked) {
        throw new Error('You must wait for the previous execution')
      } else {
        lockUser(currentUser)
      }

      let snippet

      if (currentUser.role === UserRole.GUEST) {
        snippet = await getFirstSnippet(currentUser.id)
      } else {
        if (snippetId) {
          snippet = await getSnippet(snippetId, currentUser.id)
        }
      }

      if (!snippet) {
        snippet = await createSnippet(data, currentUser)
      } else {
        snippet = await updateSnippet(snippet, data)
      }

      const executionResponse = await sendCodeToExecute(data)
      const newExecution = new Execution()

      Object.assign(newExecution, {
        ...executionResponse,
        snippet,
      })

      const savedExecution = await Execution.save(newExecution)
      unlockUser(currentUser)
      return savedExecution
    } catch (err) {
      let currentUser = await getUserFromContext(context)
      if (currentUser) unlockUser(currentUser)
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }
}
