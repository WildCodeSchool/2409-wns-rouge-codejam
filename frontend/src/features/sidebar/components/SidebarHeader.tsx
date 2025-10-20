import { SidebarTrigger } from '@/features/sidebar/components'

import {
  SidebarHeader as UISidebarHeader,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import { cn } from '@/shared/lib/utils'

export default function SidebarHeader({ children }: React.PropsWithChildren) {
  const { open } = useSidebar()

  return (
    <UISidebarHeader className="flex flex-row items-center gap-0 pt-0 pr-2 pb-4">
      <SidebarTrigger />
      <span
        className={cn(
          'font-medium -tracking-tighter whitespace-nowrap',
          open ? 'w-full pl-2' : 'w-0 overflow-hidden',
        )}
      >
        {children}
      </span>
    </UISidebarHeader>
  )
}
