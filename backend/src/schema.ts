import { buildSchema } from 'type-graphql'
import { UsersResolver } from './resolvers/users'
import { PlansResolver } from './resolvers/plans'
import { UserSubscriptionsResolver } from './resolvers/userSubscriptions'
import { SnippetsResolver } from './resolvers/snippets'
import { customAuthChecker } from './auth/customAuthChecker'

/**
 *  Builds the GraphQL schema using TypeGraphQL.
 * @returns
 */
export function getSchema() {
  return buildSchema({
    resolvers: [UsersResolver,SnippetsResolver, PlansResolver, UserSubscriptionsResolver],
    validate: true, // enable 'class-validator' integration: automatically validate all input arguments
    authChecker: customAuthChecker, // register the authorization checker function (💡 can be set to `null` to temporarily silence auth guards)
  })
}
