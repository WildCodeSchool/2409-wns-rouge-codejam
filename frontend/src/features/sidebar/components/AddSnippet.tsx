import { Plus } from 'lucide-react'

import {
  BASE_MENU_ITEM_CLASSES,
  COLLAPSED_MENU_ITEM_CLASSES,
} from '@/features/sidebar/styles'

import { TooltipButton } from '@/shared/components'
import { SidebarMenuItem, useSidebar } from '@/shared/components/ui/sidebar'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'

type AddSnippetProps = {
  onAddClick: () => void
}

export default function AddSnippet({ onAddClick }: AddSnippetProps) {
  const isMobile = useIsMobile()
  const { open } = useSidebar()

  return (
    <SidebarMenuItem
      key="add-new-snippet"
      className={cn(
        BASE_MENU_ITEM_CLASSES,
        !isMobile && !open && COLLAPSED_MENU_ITEM_CLASSES,
        'mb-4 bg-transparent px-0',
      )}
    >
      <TooltipButton
        tooltip="Add a new snippet"
        className="text-background min-h-10 w-full gap-1 rounded-md"
        onClick={() => {
          onAddClick()
        }}
      >
        <span>Add</span>
        <Plus aria-hidden="true" className="h-4 w-4" />
      </TooltipButton>
    </SidebarMenuItem>
  )
}
