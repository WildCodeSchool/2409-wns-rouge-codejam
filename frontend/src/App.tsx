import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from '@apollo/client'

import { MainLayout } from '@/shared/components/layouts'
import { Toaster } from '@/shared/components/ui/sonner'
import { EditorPage } from '@/shared/pages'
import { ErrorLink } from '@apollo/client/link/error'
import { LOGOUT } from '@/shared/api/logout'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { GET_SNIPPET } from '@/shared/api/getSnippet'

const httpLink = new HttpLink({ uri: '/api' })

// Intercepts each response to check for an expired token error.
// If found, it calls the logout mutation to refresh the client state.

// eslint-disable-next-line @typescript-eslint/no-deprecated
const logoutLink = new ErrorLink(({ graphQLErrors }) => {
  graphQLErrors?.map((error) => {
    if (error.extensions?.code === 'INVALID_JWT') {
      void client.mutate({
        mutation: LOGOUT,
        refetchQueries: [WHO_AM_I, GET_SNIPPET],
        awaitRefetchQueries: true,
      })
      return
    }
  })
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  credentials: 'same-origin',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
  link: logoutLink.concat(httpLink),
})

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={MainLayout}>
            <Route index element={<Navigate to="/editor" />} />
            <Route path="/editor" Component={EditorPage} />
            <Route
              path="/editor/:snippetId/:snippetSlug"
              Component={EditorPage}
            />
          </Route>
          <Route path="*" element={<Navigate to="/editor" replace />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}
