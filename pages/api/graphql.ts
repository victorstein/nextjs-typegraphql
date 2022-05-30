import 'reflect-metadata'
import { env } from 'env'
import { ApolloServer } from 'apollo-server-micro'
import { buildSchemaSync } from 'type-graphql'
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import resolvers from 'graphql-api'
import { AuthChecker } from 'graphql-api/auth'
import Container from 'typedi'

export const config = {
  api: {
    bodyParser: false
  }
}

const authChecker = Container.get(AuthChecker).check.bind(new AuthChecker())
const schema = buildSchemaSync({
  resolvers,
  authChecker,
  emitSchemaFile: 'schema.gql'
})

const plugins = [ApolloServerPluginLandingPageDisabled()]

if (env.NODE_ENV !== 'production') {
  plugins.push(ApolloServerPluginLandingPageGraphQLPlayground())
}

const prisma = new PrismaClient()

const serverConfig = new ApolloServer({
  schema,
  csrfPrevention: env.NODE_ENV === 'production',
  plugins,
  context: (apiContext) => ({ prisma, apiContext })
})

const server = serverConfig.start()

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await server
  await serverConfig.createHandler({ path: '/api/graphql' })(req, res)
}

export default handler
