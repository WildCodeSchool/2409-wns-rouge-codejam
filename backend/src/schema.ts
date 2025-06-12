import { buildSchema } from 'type-graphql'
import { UsersResolver } from './resolvers/users'
import { SnippetsResolver } from './resolvers/snippets'
import { customAuthChecker } from './auth/custom-auth-checker'

export function getSchema() {
  return buildSchema({
    resolvers: [UsersResolver, SnippetsResolver],
    validate: true, // enable 'class-validator' integration: automatically validate all input arguments
    authChecker: customAuthChecker,
  })
}
