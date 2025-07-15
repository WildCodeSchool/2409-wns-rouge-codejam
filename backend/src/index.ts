import 'reflect-metadata'
import { dataSource } from './datasource'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { getSchema } from './schema'

const port = process.env.PORT || 3000

async function initialize(): Promise<void> {
  await dataSource.initialize()
  const schema = await getSchema()
  const server = new ApolloServer({ schema })

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(port) },
    /**
     * Provide context to share data between resolvers.
     * The context function is called for each request.
     * Resolvers can access the context from the `context` object parameter.
     */
    context: async ({ req, res }) => {
      return { req, res }
    },
  })
  console.info(`GraphQl server ready at ${url}`)
}

initialize().catch((err: unknown) => {
  console.error('Failed to initialize the application!', err)
})
