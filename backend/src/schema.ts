import { buildSchema } from 'type-graphql'
import { UsersResolver } from './resolvers/users'
import { customAuthChecker } from './auth/custom-auth-checker'

export function getSchema() {
  return buildSchema({
    resolvers: [UsersResolver],
    validate: true, // enable 'class-validator' integration: automatically validate all input arguments
    authChecker: customAuthChecker,
  })
}
