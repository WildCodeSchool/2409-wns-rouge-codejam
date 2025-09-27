import {
  AccountSettings,
  AccountSettingsSkeleton,
  NavActions,
} from '@/features/auth/components'
import { useAuth } from '@/features/auth/hooks'
import { ModeToggle } from '@/features/mode/components'
import { useIsMobile } from '@/shared/hooks/use-mobile'

export default function NavBar() {
  const { user, loading } = useAuth()
  const isMobile = useIsMobile()

  const navContent = (() => {
    if (loading) {
      return <AccountSettingsSkeleton />
    }

    if (!user) {
      return <NavActions />
    }

    return <AccountSettings />
  })()

  return (
    <div className="gradient-accent z-20 flex justify-between rounded-xs pb-0.5">
      <header className="bg-background flex h-full w-full flex-row items-center justify-between px-2 pb-3">
        <h1 className="gradient-accent bg-clip-text text-3xl font-bold tracking-wide text-transparent">
          {isMobile ? 'CJ' : 'CodeJam'}
        </h1>

        <div className="flex flex-row items-center gap-4">
          <ModeToggle />
          {navContent}
        </div>
      </header>
    </div>
  )
}
