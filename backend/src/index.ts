import 'reflect-metadata'
import { dataSource } from './db'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSchema } from 'type-graphql'
import { UsersResolver } from './resolvers/users'
import { customAuthChecker } from './auth/custom-auth-checker'

async function initialize() {
  await dataSource.initialize()

  const schema = await buildSchema({
    resolvers: [UsersResolver],
    authChecker: customAuthChecker,
  })
  const server = new ApolloServer({ schema })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: async ({ req, res }) => {
      return { req, res }
    },
  })
  console.log(`GraphQl server ready at ${url}`)
}

initialize()
