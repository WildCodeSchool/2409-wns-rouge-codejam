import { buildSchema } from 'type-graphql'
import { UsersResolver } from './resolvers/users'
import { customAuthChecker } from './auth/customAuthChecker'
import { ExecutionResolver } from './resolvers/execution'

/**
 *  Builds the GraphQL schema using TypeGraphQL.
 * @returns
 */
export function getSchema() {
  return buildSchema({
    resolvers: [UsersResolver, ExecutionResolver],
    validate: true, // enable 'class-validator' integration: automatically validate all input arguments
    authChecker: customAuthChecker, // register the authorization checker function (💡 can be set to `null` to temporarily silence auth guards)
  })
}
