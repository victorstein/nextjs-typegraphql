import { UserProvider } from '@auth0/nextjs-auth0'
import { AppProps } from 'next/app'
import { ReactElement } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
