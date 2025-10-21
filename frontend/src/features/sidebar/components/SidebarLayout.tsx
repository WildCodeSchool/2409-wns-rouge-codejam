import { Sidebar } from '@/features/sidebar/components'
import { SidebarContextProvider } from '@/features/sidebar/providers'

import { useAppContext } from '@/shared/hooks'

export default function SidebarLayout() {
  const { user, isGuest } = useAppContext()

  if (!user || isGuest) {
    return null
  }

  return (
    <SidebarContextProvider>
      <Sidebar />
    </SidebarContextProvider>
  )
}
