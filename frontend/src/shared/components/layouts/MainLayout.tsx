import { Outlet } from 'react-router-dom'

import { NavBar } from '@/shared/components'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'

export default function MainLayout() {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'grid h-dvh grid-rows-[auto_1fr]',
        isMobile ? 'gap-2 p-2' : 'gap-4 px-2 py-4',
      )}
    >
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
