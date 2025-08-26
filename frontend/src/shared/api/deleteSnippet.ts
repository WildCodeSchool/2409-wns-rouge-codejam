import { gql } from '../gql'

export const DELETE_SNIPPET = gql(/* GraphQL */ `
  mutation deleteSnippet($id: ID!) {
    deleteSnippet(id: $id)
  }
`)
