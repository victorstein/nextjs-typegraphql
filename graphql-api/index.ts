import { resolvers } from 'graphql-api/generated'
import { customResolver } from './resolvers/custom'

export default [...resolvers, customResolver] as const
