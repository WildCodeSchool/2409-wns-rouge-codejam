import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import { EditorLayout, MainLayout } from '@/shared/components/layouts'
import { Toaster } from '@/shared/components/ui/sonner'
import { HomePage } from '@/shared/pages'

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
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={MainLayout}>
            <Route path="/" element={<Navigate to="/editor" />} />
            <Route path="/editor" Component={EditorLayout}>
              <Route index Component={HomePage} />
            </Route>
            <Route path="*" Component={HomePage} />
          </Route>
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </ApolloProvider>
  )
}
