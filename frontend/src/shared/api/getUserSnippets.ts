import { gql } from '../gql'

export const GET_ALL_SNIPPETS = gql(/* GraphQL */ `
  query getAllSnippets {
    getAllSnippets {
      id
      name
      slug
    }
  }
`)
