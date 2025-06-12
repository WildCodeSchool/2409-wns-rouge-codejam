import { Arg, ID, Mutation, Resolver } from 'type-graphql'
import { Execution, ExecutionCreateInput } from '../entities/execution'
import { sendCodeToExecute } from './utils'
// import { ContextType } from '../auth/custom-auth-checker'

@Resolver()
export class ExecutionResolver {
  @Mutation(() => Execution)
  async execute(
    // @Ctx() context: ContextType,
    @Arg('data', () => ExecutionCreateInput) data: ExecutionCreateInput,
    @Arg('snippetId', () => ID) snippetId: number,
  ): Promise<Execution> {
    try {
      // if (!context.user) {
      //   // If user does not exist, create one
      // } else {
      //   // If user exist, check if the execution number related to the user is less than 50 for this day
      // }

      // Create or modify the Snippet

      const snippet = await Snippet.findOne({
        where: { snippetId },
      })
      // If snippet does not exists, create a new one
      if (!snippet) {
        const newSnippet = new Snippet()

        Object.assign(newSnippet, {
          name: 'name',
          code: data.script,
          language: data.language,
          user_id: context.user.id,
        })

        const savedUser = await User.save(newUser)
      }

      const executionResponse = await sendCodeToExecute(data)
      const newExecution = new Execution()

      Object.assign(newExecution, {
        ...executionResponse,
        // Snippet
      })

      const savedExecution = await Execution.save(newExecution)
      return savedExecution
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }
}
