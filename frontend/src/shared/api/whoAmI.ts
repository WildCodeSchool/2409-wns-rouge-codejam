import { gql } from '../gql'

export const WHO_AM_I = gql(/* GraphQL */ `
  query whoAmI {
    whoAmI {
      id
      username
      email
    }
  }
`)

export const GET_MY_SNIPPETS = gql(/* GraphQL */ `
  query getMySnippets {
    whoAmI {
      snippets {
        code
        updatedAt
        id
        language
        name
        slug
        executions {
          status
          result
          id
          executedAt
        }
        createdAt
      }
    }
  }
`)
