import 'reflect-metadata'
import { dataSource } from './datasource'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { getSchema } from './schema'

async function initialize() {
  await dataSource.initialize()
  const schema = await getSchema()
  const server = new ApolloServer({ schema })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: async ({ req, res }) => {
      return { req, res }
    },
  })
  console.info(`GraphQl server ready at ${url}`)
}

initialize()

// TODO: to delete
// Dummy modification
