import { gql } from '../gql'

export const GET_SNIPPET = gql(/* GraphQL */ `
  query getSnippet($id: ID!, $limit: Int, $offset: Int) {
    getSnippet(id: $id, limit: $limit, offset: $offset) {
      id
      code
      language
      executions {
        id
        status
        result
        executedAt
      }
    }
  }
`)
