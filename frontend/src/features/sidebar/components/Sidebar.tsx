import {
  AddSnippet,
  ManageSnippetModals,
  SidebarHeader,
  SnippetList,
} from '@/features/sidebar/components'
import { useSidebarContext } from '@/features/sidebar/hooks'

import {
  Sidebar as SidebarUI,
  SidebarContent as SidebarUIContent,
  SidebarGroup as SidebarUIGroup,
  SidebarGroupContent as SidebarUIGroupContent,
  SidebarMenu as SidebarUIMenu,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'

export default function Sidebar() {
  const { isSidebarOpen } = useSidebarContext()

  return (
    <>
      <SidebarUI
        collapsible="icon"
        className={cn(
          'bg-background h-full rounded-none pt-0',
          isSidebarOpen &&
            'rounded-md border-0 shadow-[6px_6px_6px_0px_rgba(0,_0,_0,_0.1)]',
        )}
      >
        <SidebarUIContent className="bg-background overflow-hidden">
          <SidebarUIGroup className="justify-center px-0">
            <SidebarUIGroupContent>
              <SidebarHeader>My Snippets</SidebarHeader>
              <SidebarUIMenu className="gap-2.5 pr-4 pl-2">
                <AddSnippet />
                <SnippetList />
              </SidebarUIMenu>
            </SidebarUIGroupContent>
          </SidebarUIGroup>
        </SidebarUIContent>
      </SidebarUI>

      <ManageSnippetModals />
    </>
  )
}

export function SidebarSkeleton() {
  const { open, openMobile } = useSidebar()

  const isSidebarOpen = open || openMobile

  return (
    <SidebarUI
      collapsible="icon"
      className={cn(
        'bg-background ml-2 h-full rounded-none pt-1',
        isSidebarOpen && 'border-0 shadow-[6px_6px_6px_0px_rgba(0,_0,_0,_0.1)]',
      )}
    >
      <Skeleton className="h-full w-full" />
    </SidebarUI>
  )
}
