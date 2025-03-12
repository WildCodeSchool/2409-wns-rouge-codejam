import { gql } from '../gql'

export const GET_USERS = gql(/* GraphQL */ `
  query users {
    users {
      id
      username
      email
    }
  }
`)
