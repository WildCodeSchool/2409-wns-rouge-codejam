import { gql } from '../gql'

export const GET_SNIPPET = gql(/* GraphQL */ `
  query getSnippet($id: ID!) {
    getSnippet(id: $id) {
      id
      code
      language
    }
  }
`)
