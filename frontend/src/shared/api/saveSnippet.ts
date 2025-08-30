import { gql } from '../gql'

export const SAVE_SNIPPET = gql(/* GraphQL */ `
  mutation saveSnippet($data: SnippetCreateInput!, $id: ID!) {
    saveSnippet(data: $data, id: $id) {
      id
      slug
    }
  }
`)
