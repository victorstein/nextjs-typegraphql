import { gql } from 'apollo-server-micro'

gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      name
    }
  }
`
