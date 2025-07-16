import { buildSchema } from 'type-graphql'
import { customAuthChecker } from './auth/customAuthChecker'
import { UsersResolver } from './resolvers/UsersResolver'
import { ExecutionResolver } from './resolvers/ExecutionResolver'
import { SnippetsResolver } from './resolvers/SnippetsResolver'
import { PlansResolver } from './resolvers/PlansResolver'
import { UserSubscriptionsResolver } from './resolvers/UserSubscriptionsResolver'
/**
 *  Builds the GraphQL schema using TypeGraphQL.
 * @returns
 */
export function getSchema() {
  return buildSchema({
    resolvers: [
      UsersResolver,
      ExecutionResolver,
      SnippetsResolver,
      PlansResolver,
      UserSubscriptionsResolver,
    ],
    validate: true, // enable 'class-validator' integration: automatically validate all input arguments
    authChecker: customAuthChecker, // register the authorization checker function (💡 can be set to `null` to temporarily silence auth guards)
  })
}
