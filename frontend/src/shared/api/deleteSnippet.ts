import { gql } from '../gql'

export const DELETE_SNIPPET = gql(/* GraphQL */ `
  mutation DeleteSnippet($id: ID!) {
    deleteSnippet(id: $id)
  }
`)
