import { PanelRightCloseIcon } from 'lucide-react'

import { SidebarTrigger } from '@/shared/components/ui/sidebar'

export default function SidebarToggleButton() {
  return (
    <SidebarTrigger
      size="icon"
      className="relative -left-1 mx-2 size-9 rounded-full"
    >
      <PanelRightCloseIcon aria-hidden="true" />
    </SidebarTrigger>
  )
}
