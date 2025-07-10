import { buildSchema } from 'type-graphql'
import { UsersResolver } from './resolvers/users'
import { SnippetsResolver } from './resolvers/snippets'
import { customAuthChecker } from './auth/customAuthChecker'

/**
 *  Builds the GraphQL schema using TypeGraphQL.
 * @returns
 */
export function getSchema() {
  return buildSchema({
    resolvers: [UsersResolver, SnippetsResolver],
    validate: true, // enable 'class-validator' integration: automatically validate all input arguments
    authChecker: customAuthChecker, // register the authorization checker function (💡 can be set to `null` to temporarily silence auth guards)
  })
}
