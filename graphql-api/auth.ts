import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { env } from 'env'
import { JwksClient } from 'jwks-rsa'
import { AuthCheckerInterface, ResolverData } from 'type-graphql'
import { Service } from 'typedi'
import { AuthParams, Context, Payload } from './api.types'
import jwt from 'jsonwebtoken'

@Service()
export class AuthChecker implements AuthCheckerInterface<Context, AuthParams> {
  async verifySession({ req, res }: Context['apiContext']): Promise<Payload> {
    return await new Promise((resolve, reject) => {
      try {
        withApiAuthRequired(async (req, res) => {
          try {
            const session = getSession(req, res)

            if (session?.accessToken === undefined) {
              throw new Error('Access Token not found')
            }

            const payload = await this.validateToken(session.accessToken)

            resolve(payload as Payload)
          } catch (error) {
            reject(error)
          }
        })(req, res)
      } catch (error) {
        reject(error)
      }
    })
  }

  private async getSigningKey(kid?: string): Promise<string> {
    const client = new JwksClient({ jwksUri: env.AUTH0_JWKS_URI })

    const key = await new Promise<string | undefined>((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err !== null) return reject(err)
        const signingKey = key?.getPublicKey()
        resolve(signingKey)
      })
    })

    if (key === undefined) {
      throw new Error('Unable to find the key with the provided kid')
    }

    return key
  }

  async validateToken(token: string): Promise<jwt.JwtPayload | string> {
    return await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        ({ kid }, callback) => {
          this.getSigningKey(kid)
            .then((signingKey) => callback(null, signingKey))
            .catch((e) => reject(e))
        },
        {},
        (err, decoded) => {
          if (err !== null || decoded === undefined) {
            return reject(err)
          }

          resolve(decoded)
        }
      )
    })
  }

  verifyRole(
    permissions: string[],
    claims: string[],
    policy: boolean
  ): boolean {
    if (policy) {
      return claims.every((permission) => permissions.includes(permission))
    }
    return claims.some((permission) => permissions.includes(permission))
  }

  async check(
    { context: { apiContext } }: ResolverData<Context>,
    [{ roles = [], options: { strict } = { strict: false } } = {}]: AuthParams[]
  ): Promise<boolean> {
    const payload = await this.verifySession(apiContext)
    const userRoles = payload[env.AUTH0_NAMESPACE]
    // const userPermissions = payload.permissions

    const validRole = this.verifyRole(userRoles, roles, strict)
    if (!validRole) {
      throw new Error('Insufficient permissions for this operation')
    }

    return true
  }
}
