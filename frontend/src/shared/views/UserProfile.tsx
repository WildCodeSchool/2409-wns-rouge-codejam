import { useSuspenseQuery } from '@apollo/client'
import { GET_USERS } from '../api/users'

const UserProfile = () => {
  const { data, error } = useSuspenseQuery(GET_USERS)

  if (error) {
    return (
      <div className="">
        <h1>CodeJam</h1>
        <p>Error : {error.message}</p>
      </div>
    )
  }

  return (
    <div className="">
      <h1>CodeJam</h1>
      <p>Hello {data.users[0]?.username ?? 'CodeJamer'}</p>
    </div>
  )
}

export default UserProfile
