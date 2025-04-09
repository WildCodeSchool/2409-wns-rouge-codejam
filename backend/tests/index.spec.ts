import { ApolloServer, BaseContext } from '@apollo/server'
import { afterAll, beforeAll, describe } from '@jest/globals'
import { DataSource } from 'typeorm'
import { dataSource } from '../src/datasource'
import { getSchema } from '../src/schema'
import { UsersResolverTest } from './resolvers/UsersResolverTest'

export type TestArgs = {
  server: ApolloServer<BaseContext> | null
  dataSource: DataSource | null
  data: any
}

const testArgs: TestArgs = {
  server: null,
  dataSource: null,
  data: {},
}

// Create DB connection and empty all tables before running tests
beforeAll(async () => {
  await dataSource.initialize()
  try {
    const entities = dataSource.entityMetadatas
    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .join(', ')
    await dataSource.query(`TRUNCATE ${tableNames} CASCADE;`)
  } catch (error) {
    throw new Error(`ERROR: Cleaning test database: ${error}`)
  }

  const schema = await getSchema()
  const testServer = new ApolloServer({ schema })

  testArgs.dataSource = dataSource
  testArgs.server = testServer
})

// Close DB connection after running tests
afterAll(async () => {
  await dataSource.destroy()
})

describe('UsersResolver', () => {
  UsersResolverTest(testArgs)
})
