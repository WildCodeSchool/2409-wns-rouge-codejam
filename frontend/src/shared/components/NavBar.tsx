import {
  AccountSettings,
  AccountSettingsSkeleton,
  NavActions,
  NavActionsSkeleton,
} from '@/features/auth/components'
import { useAuth } from '@/features/auth/hooks'
import { ModeToggle } from '@/features/mode/components'

export default function NavBar() {
  const { user, loading, logout } = useAuth()

  const navContent = (() => {
    if (loading) {
      return (
        <>
          {user?.username ? (
            <AccountSettingsSkeleton />
          ) : (
            <NavActionsSkeleton />
          )}
        </>
      )
    }

    if (!user) {
      return <NavActions />
    }

    return (
      <AccountSettings
        username={user.username}
        email={user.email}
        onLogout={logout}
      />
    )
  })()

  return (
    <div className="gradient-accent z-20 flex justify-between rounded-xs pb-0.5">
      <header className="bg-background flex h-full w-full flex-row items-center justify-between px-2 pb-3">
        <h1 className="gradient-accent bg-clip-text text-3xl font-bold tracking-wide text-transparent">
          CodeJam
        </h1>

        <div className="flex flex-row items-center gap-4">
          <ModeToggle />
          {navContent}
        </div>
      </header>
    </div>
  )
}
