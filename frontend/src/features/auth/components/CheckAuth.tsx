import { WHO_AM_I } from '@/shared/api/whoAmI'
import { useQuery } from '@apollo/client'
import { Navigate } from 'react-router-dom'

export type AuthStateType = 'auth' | 'unauth'

export function CheckAuth(
  Component: React.FC,
  authState: AuthStateType,
  redirectTo = '/',
) {
  return function returnedEl(): React.ReactElement {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useQuery(WHO_AM_I)
    const me = data?.whoAmI

    if (me === undefined)
      return <div className="m-auto h-full text-center">Loading...</div>

    switch (authState) {
      case 'auth': {
        if (me) return <Component />
        break
      }
      case 'unauth': {
        if (me === null) return <Component />
        break
      }
    }
    return <Navigate to={redirectTo} replace />
  }
}
