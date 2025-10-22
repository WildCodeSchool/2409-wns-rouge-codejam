import { useContext } from 'react'

import { SidebarContext } from '@/features/sidebar/contexts/SidebarContext'

export default function useSidebarContext() {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error(
      'useSidebarContext must be used within a SidebarContextProvider!',
    )
  }
  return ctx
}
