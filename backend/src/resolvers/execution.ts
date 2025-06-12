import { Arg, Mutation, Resolver } from 'type-graphql'
import { Execution, ExecutionCreateInput } from '../entities/execution'
import { sendCodeToExecute } from './utils'
// import { ContextType } from '../auth/custom-auth-checker'

@Resolver()
export class ExecutionResolver {
  @Mutation(() => Execution)
  async execute(
    // @Ctx() context: ContextType,
    @Arg('data', () => ExecutionCreateInput) data: ExecutionCreateInput,
  ): Promise<Execution> {
    try {
      // if (!context.user) {
      //   // If user does not exist, create one
      // } else {
      //   // If user exist, check if the execution number related to the user is less than 50 for this day
      // }

      // Create or modify the Snippet

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
