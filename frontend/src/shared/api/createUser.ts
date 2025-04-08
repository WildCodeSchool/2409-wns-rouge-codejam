import { gql } from '../gql'

export const CREATE_USER = gql(/* GraphQL */ `
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      email
      username
      id
    }
  }
`)
