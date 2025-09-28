import { useQuery } from '@apollo/client'
import { PanelRightCloseIcon, Pencil, Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import CreateSnippetModal from '@/features/editor/components/CreateSnippetModal'
import { EditorUrlParams } from '@/features/editor/types'

import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { TooltipButton } from '@/shared/components'
import Modal from '@/shared/components/Modal'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Snippet } from '@/shared/gql/graphql'
import { cn } from '@/shared/lib/utils'

const activeMenuItemClasses =
  'outline-codejam-accent-300 text-codejam-accent outline-2'

const baseMenuItemClasses =
  'border-input bg-snippet-card-background flex min-h-10 cursor-pointer items-center justify-center border pl-4 pr-2 text-sm transition-colors mb-2'

const collapsedMenuItemClasses = 'w-0 overflow-hidden border-0 p-0 outline-0'

type EditorSidebarProps = {
  language: Snippet['language']
}

export default function EditorSidebar({ language }: EditorSidebarProps) {
  const { open } = useSidebar()
  const { data: { whoAmI: user } = {} } = useQuery(WHO_AM_I)

  const { data: { getAllSnippets: snippets } = {} } = useQuery(
    GET_ALL_SNIPPETS,
    {
      skip: !user,
    },
  )

  const { snippetId } = useParams<EditorUrlParams>()
  const navigate = useNavigate()
  const [activeSnippetId, setActiveSnippetId] = useState<string | undefined>(
    snippetId,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let nextActiveSnippetId: string | undefined

    if (snippetId) {
      const matchSnippet = snippets?.find((s) => s.id === snippetId)
      nextActiveSnippetId =
        matchSnippet !== undefined ? matchSnippet.id : undefined
    } else {
      nextActiveSnippetId = snippets?.[0]?.id
      // Load first snippet (if any) when user signned in and there is no snippet in the url
      if (snippets && snippets.length > 0) {
        navigate(`/editor/${snippets[0].id}/${snippets[0]?.slug}`, {
          replace: true,
        })
      }
    }
    setActiveSnippetId(nextActiveSnippetId)
  }, [snippetId, snippets, navigate])

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
          open &&
            'rounded-md border-0 shadow-[6px_6px_6px_0px_rgba(0,_0,_0,_0.1)]',
        )}
      >
        <SidebarContent className="bg-background overflow-hidden">
          <SidebarGroup className="justify-center px-0">
            <SidebarGroupContent>
              <SidebarHeader className="flex flex-row items-center pt-0 pr-2 pb-4">
                <SidebarTrigger
                  size="icon"
                  className="relative -left-1 mx-2 size-9 rounded-full"
                >
                  <PanelRightCloseIcon
                    aria-hidden="true"
                    className={cn('transition-all', open && 'rotate-180')}
                  />
                </SidebarTrigger>
                <span
                  className={cn(
                    'font-medium -tracking-tighter whitespace-nowrap',
                    open ? 'w-full pl-2' : 'w-0 overflow-hidden',
                  )}
                >
                  My Snippets
                </span>
              </SidebarHeader>

              <SidebarMenu className="gap-2.5 pr-4 pl-2">
                <SidebarMenuItem
                  key="add-new-snippet"
                  className={cn(
                    baseMenuItemClasses,
                    !open && collapsedMenuItemClasses,
                    'mb-4 bg-transparent px-0',
                  )}
                >
                  <TooltipButton
                    tooltip="Add a new snippet"
                    className="text-background min-h-10 w-full gap-1 rounded"
                    onClick={() => {
                      setIsModalOpen(true)
                    }}
                  >
                    <span>Add</span>
                    <Plus aria-hidden="true" className="h-4 w-4" />
                  </TooltipButton>
                </SidebarMenuItem>

                {(snippets ?? []).map((snippet) => (
                  <SidebarMenuItem
                    key={snippet.id}
                    className={cn(
                      baseMenuItemClasses,
                      activeSnippetId === snippet.id && activeMenuItemClasses,
                      !open && collapsedMenuItemClasses,
                    )}
                    onClick={() => {
                      navigate(`/editor/${snippet.id}/${snippet.slug}`)
                    }}
                  >
                    <span className="flex-1 truncate text-left text-nowrap">
                      {snippet.name}
                    </span>
                    <div className="flex">
                      <TooltipButton
                        tooltip="Rename snippet"
                        variant="ghost"
                        size="icon"
                        className="rounded-full px-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`🚧 Rename snippet ${snippet.id}...`)
                        }}
                      >
                        <Pencil aria-hidden="true" />
                      </TooltipButton>

                      <TooltipButton
                        tooltip="Delete snippet"
                        variant="ghost"
                        size="icon"
                        className="hover:text-error rounded-full px-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`🚧 Delete snippet ${snippet.id}...`)
                        }}
                      >
                        <Trash aria-hidden="true" />
                      </TooltipButton>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Modal
        title="Create Snippet"
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <CreateSnippetModal
          language={language}
          onClose={() => {
            setIsModalOpen(false)
          }}
        />
      </Modal>
    </>
  )
}

export function EditorSidebarSkeleton() {
  const { open } = useSidebar()
  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        'bg-background ml-2 h-full rounded-none pt-1',
        open && 'border-0 shadow-[6px_6px_6px_0px_rgba(0,_0,_0,_0.1)]',
      )}
    >
      <Skeleton className="h-full w-full" />
    </Sidebar>
  )
}
