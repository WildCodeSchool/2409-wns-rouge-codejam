import { Arg, Ctx, ID, Mutation, Resolver } from 'type-graphql'
import { Execution, ExecutionCreateInput } from '../entities/Execution'
import { createUser, sendCodeToExecute } from './utils'
import requestIp from 'request-ip'
import { ContextType } from '../types'
import { User } from '../entities/User'
import { Snippet } from '../entities/Snippet'
// import { ContextType } from '../auth/custom-auth-checker'

@Resolver()
export class ExecutionResolver {
  @Mutation(() => Execution)
  async execute(
    @Ctx() context: ContextType,
    @Arg('data', () => ExecutionCreateInput) data: ExecutionCreateInput,
    @Arg('snippetId', () => ID, { nullable: true }) snippetId?: string,
  ): Promise<Execution> {
    try {
      // If user does not exist and ip address does not correspond to an existing user, create one
      const clientIp = requestIp.getClientIp(context.req)

      console.log('Ip Address', clientIp)

      if (!context.user) {
        const newGuestUser: Partial<User> = {}
      } else {
        // If user exist, check if the execution number related to the user is less than 50 for this day
      }

      // const user = User.findOne({where: })

      // Create or modify the Snippet
      const snippet = await Snippet.findOne({
        where: { id: snippetId },
      })

      // // If snippet does not exists and user connected, create a new one
      // if (!snippet) {
      //   const newSnippet = new Snippet()

      //   Object.assign(newSnippet, {
      //     name: 'name',
      //     code: data.script,
      //     language: data.language,
      //     userId: context.user.id,
      //   })

      //   const savedSnippet = await Snippet.save(newSnippet)
      // }

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
