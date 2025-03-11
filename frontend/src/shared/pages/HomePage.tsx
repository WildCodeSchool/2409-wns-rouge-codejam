import { Suspense } from 'react'
import UserProfile from '../views/UserProfile'

const HomePage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserProfile />
    </Suspense>
  )
}

export default HomePage
