import { gql } from '../gql'

export const UPDATE_SNIPPET = gql(/* GraphQL */ `
  mutation UpdateSnippet($data: SnippetUpdateInput!, $updateSnippetId: ID!) {
    updateSnippet(data: $data, id: $updateSnippetId) {
      id
      slug
    }
  }
`)
