import { gql } from '../gql'

export const WHO_AM_I = gql(/* GraphQL */ `
  query whoAmI {
    whoAmI {
      id
      username
      email
    }
  }
`)
