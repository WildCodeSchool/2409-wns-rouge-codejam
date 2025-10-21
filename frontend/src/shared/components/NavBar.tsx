import {
  AccountSettings,
  AccountSettingsSkeleton,
  NavActions,
} from '@/features/auth/components'
import { useAuth } from '@/features/auth/hooks'
import { ModeToggle } from '@/features/mode/components'
import { SidebarTrigger } from '@/features/sidebar/components'

import { Separator } from '@/shared/components/ui/separator'
import { useSidebar } from '@/shared/components/ui/sidebar'

export default function NavBar() {
  const { user, loading } = useAuth()
  const { isMobile } = useSidebar()

  const showSidebar = isMobile && user?.email

  const navContent = (() => {
    if (loading) {
      return <AccountSettingsSkeleton />
    }

    if (!user?.email) {
      return <NavActions />
    }

    return <AccountSettings />
  })()

  return (
    <div className="gradient-accent z-20 flex justify-between rounded-xs pb-0.5">
      <header className="bg-background flex h-full w-full flex-row items-center justify-between px-2 pb-3">
        <div className="flex h-9 flex-1 items-center gap-4">
          <h1 className="gradient-accent bg-clip-text text-3xl font-bold tracking-wide text-transparent">
            {isMobile ? 'CJ' : 'CodeJam'}
          </h1>
          {showSidebar && (
            <div className="flex h-full items-center">
              <Separator orientation="vertical" className="h-3/4!" />
              <SidebarTrigger />
            </div>
          )}
        </div>

        <div className="flex flex-row items-center gap-4">
          <ModeToggle />
          {navContent}
        </div>
      </header>
    </div>
  )
}
