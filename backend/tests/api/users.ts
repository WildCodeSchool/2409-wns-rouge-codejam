export const CREATE_USER = `#graphql
  mutation users($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`

export const LOGIN = `#graphql
  mutation login($data: UserLoginInput!) {
    login(data: $data) {
      id
    }
  }
`
