import { useQuery } from '@apollo/client'
import { Pencil, Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CreateSnippetModal from '@/features/editor/components/CreateSnippetModal'
import { EditorUrlParams } from '@/features/editor/types'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
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
import TooltipButton from '@/shared/TooltipButton'

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
        className="bg-sidebar-foreground h-screen rounded-md"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarHeader>
                <div className="flex justify-between">
                  {open && (
                    <span
                      className={cn(
                        'text-sidebar-foreground/70 ring-sidebar-ring text-md flex h-8 shrink-0 items-center rounded-md px-2 font-medium whitespace-nowrap outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
                        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
                      )}
                    >
                      My Snippets
                    </span>
                  )}
                  <SidebarTrigger
                    className="bg-accent size-9 rounded-full"
                    size="icon"
                  />
                </div>
              </SidebarHeader>
              {open && (
                <SidebarMenu className="gap-3">
                  <SidebarMenuItem
                    key="add-new-snippet"
                    className="flex justify-center py-1 text-sm"
                  >
                    <TooltipButton
                      tooltip="Create snippet"
                      onClick={() => {
                        setIsModalOpen(true)
                      }}
                      variant={null}
                      className="w-full rounded"
                    >
                      <Plus className="h-4 w-4 text-neutral-300 group-hover:text-neutral-100" />
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
                          <Pencil className={iconsStyles} />
                        </TooltipButton>

                        <TooltipButton
                          tooltip="Delete snippet"
                          variant={null}
                          size="icon"
                          className="rounded-full px-0"
                        >
                          <Trash className={iconsStyles} />
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
