import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { getCSRClient, getSSRClient } from '@/libs/client'

export default function App({ Component, pageProps }: AppProps) {
  const client = getCSRClient()
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )

}