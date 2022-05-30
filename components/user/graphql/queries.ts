import { gql } from 'apollo-server-micro'

gql`
  query users {
    users {
      id
      name
    }
  }
`
