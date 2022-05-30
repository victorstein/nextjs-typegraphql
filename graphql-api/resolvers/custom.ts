import { Authorized } from 'graphql-api/api.types'
import { Query, Resolver } from 'type-graphql'

@Resolver()
export class customResolver {
  @Query(() => String)
  @Authorized({ roles: ['admin'] })
  hello(): string {
    return 'world'
  }
}
