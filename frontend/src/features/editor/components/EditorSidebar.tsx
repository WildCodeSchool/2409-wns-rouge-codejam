import { useQuery, useMutation } from '@apollo/client'
import { PanelRightCloseIcon, Pencil, Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import CreateSnippetModal from '@/features/editor/components/CreateSnippetModal'
import { EditorUrlParams } from '@/features/editor/types'

import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { DELETE_SNIPPET } from '@/shared/api/deleteSnippet'
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
import { Spinner } from '@/shared/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'sonner'
import {
  Snippet,
  type DeleteSnippetMutation,
  type DeleteSnippetMutationVariables,
} from '@/shared/gql/graphql'
import { cn } from '@/shared/lib/utils'

type EditorSidebarProps = {
  language: Snippet['language']
}

// Minimal UI shape used by the delete flow
type SnippetLite = Pick<Snippet, 'id' | 'name' | 'slug'>

export default function EditorSidebar({ language }: EditorSidebarProps) {
  const { open } = useSidebar()
  const { data: { whoAmI: user } = {}, loading: loadingUser } =
    useQuery(WHO_AM_I)

  const { data: { getAllSnippets: snippets } = {}, loading: loadingSnippets } =
    useQuery(GET_ALL_SNIPPETS, {
      skip: !user,
    })

  const { snippetId } = useParams<EditorUrlParams>()
  const navigate = useNavigate()
  const [activeSnippetId, setActiveSnippetId] = useState<string | undefined>(
    snippetId,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Controlled modal: delete — stores the target snippet
  const [deleteTarget, setDeleteTarget] = useState<SnippetLite | null>(null)

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

  // Helper: open the delete modal with a sanitized UI shape
  const openDelete = (s: SnippetLite) => {
    setDeleteTarget({ id: s.id, name: s.name, slug: s.slug })
  }

  // Helper: close the delete modal (separate function to satisfy lint rules)
  const handleCancelDelete = () => {
    setDeleteTarget(null)
  }

  // Close modal when Modal's open state becomes false
  const handleDeleteOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setDeleteTarget(null)
    }
  }

  // Helper: choose neighbor (prefer previous, otherwise next) from the current list
  const pickNeighborBeforeDelete = (toDeleteId: string): SnippetLite | null => {
    // Normalize list to avoid repeating null checks
    const list = snippets ?? []
    if (list.length === 0) return null

    const idx = list.findIndex((s) => s.id === toDeleteId)
    if (idx === -1) return null

    // `.at()` returns `T | undefined`, which plays well with the linter
    const prev = list.at(idx - 1)
    const next = list.at(idx + 1)
    const chosen = prev ?? next

    if (!chosen) return null
    return { id: chosen.id, name: chosen.name, slug: chosen.slug }
  }
  // Delete mutation — refetch list (same approach as edit)
  const [deleteSnippet] = useMutation<
    DeleteSnippetMutation,
    DeleteSnippetMutationVariables // if missing after rebase, replace with { id: string }
  >(DELETE_SNIPPET, {
    refetchQueries: [{ query: GET_ALL_SNIPPETS }],
    awaitRefetchQueries: true,
  })

  // Execute deletion then navigate if necessary; close modal and notify.
  // Returns true on success, false otherwise.
  const confirmDelete = async (): Promise<boolean> => {
    if (!deleteTarget) return false

    // Compute the neighbor BEFORE the list changes (based on current query result)
    const neighbor = pickNeighborBeforeDelete(deleteTarget.id)

    try {
      await deleteSnippet({ variables: { id: deleteTarget.id } })

      // If the deleted item was the active one -> activate neighbor if any, else go to /editor
      if (activeSnippetId === deleteTarget.id) {
        if (neighbor) {
          navigate(`/editor/${neighbor.id}/${neighbor.slug}`, { replace: true })
        } else {
          navigate('/editor', { replace: true })
        }
      }

      toast.success(`“${deleteTarget.name}” was deleted.`)
      setDeleteTarget(null) // close modal
      return true
    } catch {
      toast.error('An error occurred while deleting the snippet.')
      return false
    }
  }

  if (loadingUser || loadingSnippets) {
    return <Spinner />
  }

  //  If user is guest
  if (!user?.email) {
    return null
  }

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

                        {/* Delete action opens the controlled modal */}
                        <TooltipButton
                          tooltip="Delete snippet"
                          variant={null}
                          size="icon"
                          className="rounded-full px-0"
                          onClick={() => {
                            openDelete(snippet as SnippetLite)
                          }}
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
      {/* Delete confirmation modal (controlled) */}
      <Modal
        title={deleteTarget ? `Delete snippet “${deleteTarget.name}”?` : ''}
        open={!!deleteTarget}
        onOpenChange={handleDeleteOpenChange}
      >
        <div className="space-y-4">
          <p>This action is irreversible.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
