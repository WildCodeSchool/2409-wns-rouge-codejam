import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import HomePage from '@/shared/pages/HomePage'
import Layout from './shared/components/Layout'

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

const App = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Layout}>
            <Route index Component={HomePage} />
            <Route path="/:snippetId/:slug" Component={HomePage} />
          </Route>
          <Route path="*" Component={HomePage} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
