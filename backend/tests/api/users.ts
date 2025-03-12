export const CREATE_USER = `#graphql
  mutation users($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`
