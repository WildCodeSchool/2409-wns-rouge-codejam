import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import HomePage from '@/shared/pages/HomePage'
import Layout from './shared/views/Layout'

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
            <Route path="/" Component={HomePage} />
            <Route path="*" Component={HomePage} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
