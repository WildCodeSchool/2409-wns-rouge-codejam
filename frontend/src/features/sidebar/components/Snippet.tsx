import { Pencil, Trash } from 'lucide-react'

import {
  ACTIVE_MENU_ITEM_CLASSES,
  BASE_MENU_ITEM_CLASSES,
  COLLAPSED_MENU_ITEM_CLASSES,
} from '@/features/sidebar/styles'

import { TooltipButton } from '@/shared/components'
import { SidebarMenuItem, useSidebar } from '@/shared/components/ui/sidebar'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'

type SnippetProps = React.PropsWithChildren & {
  isActive: boolean
  onSnippetClick: () => void
  onSnippetDelete: () => void
  onSnippetEdit: () => void
}

export default function Snippet({
  children,
  isActive,
  onSnippetClick,
  onSnippetDelete,
  onSnippetEdit,
}: SnippetProps) {
  const isMobile = useIsMobile()
  const { open } = useSidebar()

  return (
    <SidebarMenuItem
      onClick={() => {
        onSnippetClick()
      }}
      className={cn(
        BASE_MENU_ITEM_CLASSES,
        isActive && ACTIVE_MENU_ITEM_CLASSES,
        !isMobile && !open && COLLAPSED_MENU_ITEM_CLASSES,
      )}
    >
      <span className="flex-1 truncate text-left text-nowrap">{children}</span>
      <div className="flex">
        <TooltipButton
          tooltip="Rename snippet"
          variant="ghost"
          size="icon"
          className="rounded-full px-0"
          onClick={(e) => {
            e.stopPropagation()
            onSnippetEdit()
          }}
        >
          <Pencil aria-hidden="true" />
        </TooltipButton>

        <TooltipButton
          tooltip="Delete snippet"
          variant="ghost"
          size="icon"
          className="hover:text-error focus-visible:text-error rounded-full px-0"
          onClick={(e) => {
            e.stopPropagation()
            onSnippetDelete()
          }}
        >
          <Trash aria-hidden="true" />
        </TooltipButton>
      </div>
    </SidebarMenuItem>
  )
}
