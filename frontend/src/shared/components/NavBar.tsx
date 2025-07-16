import { Suspense } from 'react'
import NavActions from '@/features/auth/components/NavActions'
import { Spinner } from '@/shared/components/ui/spinner'

const NavBar = () => {
  return (
    <div className="flex justify-between rounded-xs bg-gradient-to-r from-[#0369A1] via-[#7DD3FC] to-[#0369A1] pb-0.5">
      <header className="bg-background flex h-full w-full flex-row items-center justify-between pb-3">
        <h1 className="bg-gradient-to-r from-[#0369A1] via-[#7DD3FC] to-[#0369A1] bg-clip-text text-3xl font-bold tracking-wide text-transparent">
          CodeJam
        </h1>
        <Suspense fallback={<Spinner className="min-h-8" />}>
          <NavActions />
        </Suspense>
      </header>
    </div>
  )
}

export default NavBar
