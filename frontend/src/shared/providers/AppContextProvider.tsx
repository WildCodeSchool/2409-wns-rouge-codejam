import { useQuery, useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { EditorUrlParams } from '@/features/editor/types'

import { DELETE_USER } from '@/shared/api/deleteUser'
import { GET_SNIPPET } from '@/shared/api/getSnippet'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { LOGOUT } from '@/shared/api/logout'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { TOAST_OPTIONS } from '@/shared/config'
import { AppContext } from '@/shared/contexts'

export default function AppContextProvider({
  children,
}: React.PropsWithChildren) {
  const navigate = useNavigate()
  const { snippetId } = useParams<EditorUrlParams>()

  const {
    data: userData,
    loading: loadingUser,
    error: errorUser,
  } = useQuery(WHO_AM_I)

  const user = userData?.whoAmI
  const isGuest = user ? !user.email : undefined

  const {
    data: dataSnippets,
    loading: loadingSnippets,
    error: errorSnippets,
  } = useQuery(GET_ALL_SNIPPETS, {
    skip: !user || isGuest,
  })

  const {
    data: dataSnippet,
    error: errorSnippet,
    loading: loadingSnippet,
  } = useQuery(GET_SNIPPET, {
    ...(snippetId ? { variables: { id: snippetId, limit: 1, offset: 0 } } : {}),
    skip: !snippetId,
  })

  const [logoutMutation] = useMutation(LOGOUT)
  const [deleteUser] = useMutation(DELETE_USER)

  const logout = useCallback(async () => {
    try {
      await logoutMutation({
        refetchQueries: [{ query: WHO_AM_I }],
        awaitRefetchQueries: true,
      })
      toast.success('Successful logout', {
        ...TOAST_OPTIONS.success,
        description: 'Hope to see you soon 👋',
      })
      navigate('/editor', {
        replace: true,
      })
    } catch (error: unknown) {
      console.error(error)
      toast.error('Oops! We couldn’t log you out...', {
        ...TOAST_OPTIONS.error,
      })
    }
  }, [logoutMutation, navigate])

  const deleteAccount = useCallback(async () => {
    try {
      await deleteUser({
        refetchQueries: [WHO_AM_I],
        awaitRefetchQueries: true,
      })
      toast.success('Account successfully deleted', {
        description: '👋 Hope to see you soon!',
      })

      navigate('/editor', {
        replace: true,
      })
    } catch (error: unknown) {
      console.error(error)
      toast.error('Failed to delete account', {
        description: 'Oops! Something went wrong.',
      })
    }
  }, [deleteUser, navigate])

  const snippets = dataSnippets?.getAllSnippets ?? []
  const snippet = dataSnippet?.getSnippet

  const ctx = {
    deleteAccount,
    errorUser,
    errorSnippet,
    errorSnippets,
    isGuest,
    loadingUser,
    loadingSnippet,
    loadingSnippets,
    logout,
    snippet,
    snippets,
    user,
  }

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>
}
