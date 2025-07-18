import { gql } from '../gql'

export const CREATE_SNIPPET = gql(/* GraphQL */ `
  mutation CreateSnippet($data: SnippetCreateInput!) {
    createSnippet(data: $data) {
      id
      name
      slug
    }
  }
`)
