import { Suspense } from 'react'
import NavActions from '@/features/auth/components/NavActions'
import { Spinner } from '@/shared/components/ui/spinner'

const NavBar = () => {
  return (
    <header className="flex flex-row items-center justify-between border-b pb-4">
      <h1 className="text-xl font-bold">CodeJam</h1>
      <Suspense fallback={<Spinner className="min-h-9" />}>
        <NavActions />
      </Suspense>
    </header>
  )
}

export default NavBar
