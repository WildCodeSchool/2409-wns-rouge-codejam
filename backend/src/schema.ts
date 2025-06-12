import { buildSchema } from 'type-graphql'
import { UsersResolver } from './resolvers/users'
import { customAuthChecker } from './auth/custom-auth-checker'
import { ExecutionResolver } from './resolvers/execution'

export function getSchema() {
  return buildSchema({
    resolvers: [UsersResolver, ExecutionResolver],
    validate: true, // enable 'class-validator' integration: automatically validate all input arguments
    authChecker: customAuthChecker,
  })
}
