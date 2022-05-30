const {
  NODE_ENV,
  AUTH0_SECRET,
  AUTH0_BASE_URL,
  AUTH0_ISSUER_BASE_URL,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_APP_ID,
  AUTH0_JWKS_URI,
  AUTH0_NAMESPACE
} = process.env

export const env = {
  NODE_ENV: NODE_ENV ?? 'development',
  AUTH0_SECRET: AUTH0_SECRET ?? '',
  AUTH0_BASE_URL,
  AUTH0_ISSUER_BASE_URL,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_APP_ID,
  AUTH0_JWKS_URI: AUTH0_JWKS_URI ?? '',
  AUTH0_NAMESPACE: AUTH0_NAMESPACE ?? ''
}
