import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import { MainLayout } from '@/shared/components/layouts'
import { Toaster } from '@/shared/components/ui/sonner'
import { EditorPage } from '@/shared/pages'

const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
  credentials: 'same-origin',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
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
