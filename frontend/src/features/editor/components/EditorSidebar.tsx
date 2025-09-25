import { useQuery } from '@apollo/client'
import { PanelRightCloseIcon, Pencil, Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CreateSnippetModal from '@/features/editor/components/CreateSnippetModal'
import { EditorUrlParams } from '@/features/editor/types'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { Snippet } from '@/shared/gql/graphql'
import { cn } from '@/shared/lib/utils'

type EditorSidebarProps = {
  language: Snippet['language']
}

export default function EditorSidebar({ language }: EditorSidebarProps) {
  const { open } = useSidebar()
  const { data: { getAllSnippets: snippets } = {} } = useQuery(GET_ALL_SNIPPETS)

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

  const hoveredTextStyles = 'text-neutral-300 hover:text-neutral-100'
  const iconsStyles = `cursor-pointer h-4 w-4 ${hoveredTextStyles}`

  return (
    <>
      <Sidebar
        collapsible="icon"
        className={cn(
          'bg-background ml-2 h-full rounded-none pt-1',
          open && 'border-0 shadow-[6px_6px_6px_0px_rgba(0,_0,_0,_0.1)]',
        )}
      >
        <SidebarContent className="bg-background">
          <SidebarGroup className="justify-center px-0">
            <SidebarGroupContent>
              <SidebarHeader className="text-sidebar-foreground/70 flex flex-row items-center pt-0 pr-2 pb-2">
                <span
                  className={cn(
                    'font-medium -tracking-tighter whitespace-nowrap',
                    open ? 'w-full pl-2' : 'w-0 overflow-hidden',
                  )}
                >
                  My Snippets
                </span>
                <SidebarTrigger size="icon" className="size-9 rounded-full">
                  <PanelRightCloseIcon
                    aria-hidden="true"
                    role="img"
                    className={cn('transition-all', open && 'rotate-180')}
                  />
                </SidebarTrigger>
              </SidebarHeader>

              {open && (
                <SidebarMenu className="gap-2.5 px-4 pt-0.5">
                  <SidebarMenuItem
                    key="add-new-snippet"
                    className="flex justify-center py-1 text-sm"
                  >
                    <TooltipButton
                      tooltip="Create snippet"
                      variant={null}
                      className="w-full rounded"
                      onClick={() => {
                        setIsModalOpen(true)
                      }}
                    >
                      <Plus
                        aria-hidden="true"
                        role="img"
                        className="h-4 w-4 text-neutral-300 group-hover:text-neutral-100"
                      />
                    </TooltipButton>
                  </SidebarMenuItem>

                  {(snippets ?? []).map((snippet) => (
                    <SidebarMenuItem
                      key={snippet.id}
                      className="flex cursor-pointer justify-between gap-0.5 py-1"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              navigate(`/editor/${snippet.id}/${snippet.slug}`)
                            }}
                            className={cn(
                              'flex-1 cursor-pointer justify-start truncate rounded-md px-2 py-1.5 text-left transition-colors',
                              activeSnippetId === snippet.id
                                ? 'text-sky-500 hover:text-sky-300'
                                : hoveredTextStyles,
                            )}
                          >
                            {snippet.name}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                          {snippet.name}
                        </TooltipContent>
                      </Tooltip>

                      <div className="flex items-center pr-2">
                        <TooltipButton
                          tooltip="Rename snippet"
                          variant={null}
                          size="icon"
                          className="min-w-0 rounded-full px-0"
                        >
                          <Pencil
                            aria-hidden="true"
                            role="img"
                            className={iconsStyles}
                          />
                        </TooltipButton>

                        <TooltipButton
                          tooltip="Delete snippet"
                          variant={null}
                          size="icon"
                          className="rounded-full px-0"
                        >
                          <Trash
                            aria-hidden="true"
                            role="img"
                            className={iconsStyles}
                          />
                        </TooltipButton>
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
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
