import { CreateSnippetModal } from '@/features/editor/components'
import {
  AddSnippet,
  SidebarHeader,
  Snippet,
} from '@/features/sidebar/components'
import { useEditorSidebar } from '@/features/sidebar/hooks'

import Modal from '@/shared/components/Modal'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Snippet as TSnippet } from '@/shared/gql/graphql'
import { cn } from '@/shared/lib/utils'

type EditorSidebarProps = {
  language: TSnippet['language']
}

export default function EditorSidebar({ language }: EditorSidebarProps) {
  const {
    activeSnippetId,
    closeModal,
    isModalOpen,
    isSidebarOpen,
    openModal,
    selectSnippet,
    snippets,
    toggleModal,
    user,
  } = useEditorSidebar()

  //  If user is guest
  if (!user?.email) {
    return null
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className={cn(
          'bg-background h-full rounded-none pt-0',
          isSidebarOpen &&
            'rounded-md border-0 shadow-[6px_6px_6px_0px_rgba(0,_0,_0,_0.1)]',
        )}
      >
        <SidebarContent className="bg-background overflow-hidden">
          <SidebarGroup className="justify-center px-0">
            <SidebarGroupContent>
              <SidebarHeader>My Snippets</SidebarHeader>

              <SidebarMenu className="gap-2.5 pr-4 pl-2">
                <AddSnippet onAddClick={openModal} />

                {(snippets ?? []).map((snippet) => (
                  <Snippet
                    key={snippet.id}
                    isActive={activeSnippetId === snippet.id}
                    onSnippetClick={() => {
                      selectSnippet(snippet.id, snippet.slug)
                    }}
                    onSnippetDelete={() => {
                      alert(`🚧 Delete snippet ${snippet.id}...`)
                    }}
                    onSnippetEdit={() => {
                      alert(`🚧 Rename snippet ${snippet.id}...`)
                    }}
                  >
                    {snippet.name}
                  </Snippet>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Modal
        title="Create Snippet"
        open={isModalOpen}
        onOpenChange={toggleModal}
      >
        <CreateSnippetModal language={language} onClose={closeModal} />
      </Modal>
    </>
  )
}

export function EditorSidebarSkeleton() {
  const { open, openMobile } = useSidebar()

  const isSidebarOpen = open || openMobile

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        'bg-background ml-2 h-full rounded-none pt-1',
        isSidebarOpen && 'border-0 shadow-[6px_6px_6px_0px_rgba(0,_0,_0,_0.1)]',
      )}
    >
      <Skeleton className="h-full w-full" />
    </Sidebar>
  )
}
