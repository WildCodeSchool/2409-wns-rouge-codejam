import { gql } from '../gql'

export const EXECUTE = gql(/* GraphQL */ `
  mutation Mutation($data: SnippetCreateInput!, $snippetId: ID) {
    execute(data: $data, snippetId: $snippetId) {
      id
      result
      status
      snippet {
        id
        name
        slug
        language
        updatedAt
      }
    }
  }
`)
