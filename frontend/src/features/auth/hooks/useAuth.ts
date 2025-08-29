import { useQuery, useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { LOGOUT } from '@/shared/api/logout'
import { WHO_AM_I } from '@/shared/api/whoAmI'

export default function useAuth() {
  const navigate = useNavigate()
  const { data, loading } = useQuery(WHO_AM_I)
  const [logoutMutation] = useMutation(LOGOUT)

  const logout = useCallback(async () => {
    try {
      await logoutMutation({
        refetchQueries: [{ query: WHO_AM_I }],
        awaitRefetchQueries: true,
      })
      toast.success('Successful logout', {
        description: '👋 Hope to see you soon!',
      })
      navigate('/editor', {
        replace: true,
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
