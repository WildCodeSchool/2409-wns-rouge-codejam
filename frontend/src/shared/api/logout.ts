import { gql } from '../gql'

export const LOGOUT = gql(/* GraphQL */ `
  mutation logout {
    logout
  }
`)
