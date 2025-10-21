import { gql } from '../gql'

export const DELETE_USER = gql(/* GraphQL */ `
  mutation deletUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId)
  }
`)
