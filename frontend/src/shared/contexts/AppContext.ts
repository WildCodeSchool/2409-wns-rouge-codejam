import { ApolloError } from '@apollo/client'
import { createContext } from 'react'

import {
  GetAllSnippetsQuery,
  GetSnippetQuery,
  WhoAmIQuery,
} from '@/shared/gql/graphql'

type AppContextValue = {
  deleteAccount: () => Promise<void>
  errorUser: ApolloError | undefined
  errorSnippet: ApolloError | undefined
  errorSnippets: ApolloError | undefined
  isGuest: boolean | undefined
  loadingUser: boolean
  loadingSnippet: boolean
  loadingSnippets: boolean
  logout: () => Promise<void>
  snippet: GetSnippetQuery['getSnippet'] | undefined
  snippets: GetAllSnippetsQuery['getAllSnippets']
  user: WhoAmIQuery['whoAmI'] | undefined
}

export const AppContext = createContext<AppContextValue | null>(null)
