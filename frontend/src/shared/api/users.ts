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

export const WHO_AM_I = gql(/* GraphQL */ `
  query whoAmI {
    whoAmI {
      id
      username
      email
    }
  }
`)
