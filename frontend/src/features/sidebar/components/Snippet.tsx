import { Pencil, Trash } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { EditorUrlParams } from '@/features/editor/types'
import { useSidebarContext } from '@/features/sidebar/hooks'
import {
  ACTIVE_MENU_ITEM_CLASSES,
  BASE_MENU_ITEM_CLASSES,
  COLLAPSED_MENU_ITEM_CLASSES,
} from '@/features/sidebar/styles'

import { TooltipButton } from '@/shared/components'
import { SidebarMenuItem, useSidebar } from '@/shared/components/ui/sidebar'
import { Snippet as TSnippet } from '@/shared/gql/graphql'
import { useIsMobile } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

type SnippetProps = React.PropsWithChildren & {
  id: TSnippet['id']
  slug: TSnippet['slug']
}

export default function Snippet({ id, slug, children }: SnippetProps) {
  const isMobile = useIsMobile()
  const { open } = useSidebar()
  const { snippetId } = useParams<EditorUrlParams>()
  const {
    selectSnippet,
    selectTargetSnippet,
    setEdit,
    openDeleteModal,
    openEditModal,
  } = useSidebarContext()

  const isActive = id === snippetId

  return (
    <SidebarMenuItem
      onClick={() => {
        selectSnippet(id, slug)
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
            setEdit(true)
            selectTargetSnippet(id)
            openEditModal()
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
            selectTargetSnippet(id)
            openDeleteModal()
          }}
        >
          <Trash aria-hidden="true" />
        </TooltipButton>
      </div>
    </SidebarMenuItem>
  )
}
