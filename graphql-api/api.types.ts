import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { Authorized as Auth } from 'type-graphql'
import { MethodAndPropDecorator } from 'type-graphql/dist/decorators/types'

export interface Context {
  apiContext: {
    req: NextApiRequest
    res: NextApiResponse
  }
  prisma: PrismaClient
}

export interface AuthParams {
  roles?: string[]
  options?: {
    strict: boolean
  }
}

export interface Payload {
  permissions: string[]
  [namespace: string]: string[]
}

export const Authorized = (roles: AuthParams): MethodAndPropDecorator =>
  Auth<AuthParams>(roles)
