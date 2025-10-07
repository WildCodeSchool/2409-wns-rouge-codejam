import { PanelRightCloseIcon } from 'lucide-react'

import { SidebarTrigger as UISidebarTrigger } from '@/shared/components/ui/sidebar'

export default function SidebarTrigger() {
  return (
    <UISidebarTrigger
      size="icon"
      className="relative -left-1 mx-2 size-9 rounded-full"
    >
      <PanelRightCloseIcon aria-hidden="true" />
    </UISidebarTrigger>
  )
}
