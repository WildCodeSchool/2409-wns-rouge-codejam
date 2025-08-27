import { useQuery, useMutation } from '@apollo/client'
import { toast } from 'sonner'

import { LOGOUT } from '@/shared/api/logout'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { useCallback } from 'react'

export default function useAuth() {
  const { data, loading } = useQuery(WHO_AM_I)
  const [logoutMutation] = useMutation(LOGOUT)

  const logout = useCallback(async () => {
    try {
      await logoutMutation({
        refetchQueries: [{ query: WHO_AM_I }],
      })
      toast.success('Successful logout', {
        description: '👋 Hope to see you soon!',
      })
    } catch (error: unknown) {
      console.error(error)
      toast.error('Failed to logout', {
        description: 'Oops! Something went wrong.',
      })
    }
  }, [logoutMutation])

  return { user: data?.whoAmI, loading, logout }
}
