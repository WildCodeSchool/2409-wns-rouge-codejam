import { gql } from '../gql'

export const LOGIN = gql(/* GraphQL */ `
  mutation login($data: UserLoginInput!) {
    login(data: $data) {
      id
      username
    }
  }
`)
