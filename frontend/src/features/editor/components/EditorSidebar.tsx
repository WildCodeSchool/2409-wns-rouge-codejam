import { useQuery } from '@apollo/client'
import { Pencil, Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import CreateSnippetModal from '@/features/editor/components/CreateSnippetModal'
import { EditorUrlParams } from '@/features/editor/types'

import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import Modal from '@/shared/components/Modal'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
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
import { Snippet } from '@/shared/gql/graphql'
import { cn } from '@/shared/lib/utils'

type EditorSidebarProps = {
  language: Snippet['language']
}

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

  useEffect(() => {
    let nextActiveSnippetId: string | undefined

    if (snippetId) {
      nextActiveSnippetId = (
        snippets?.find((s) => s.id === snippetId) ?? snippets?.[0]
      )?.id
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
        className="bg-sidebar-foreground h-screen w-100 rounded-md"
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
                  <SidebarTrigger className="bg-accent" />
                </div>
              </SidebarHeader>
              {open && (
                <SidebarMenu className="gap-3">
                  <SidebarMenuItem key="add-new-snippet">
                    <SidebarMenuButton
                      className="group flex cursor-pointer items-center justify-center"
                      onClick={() => {
                        setIsModalOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 text-neutral-300 group-hover:text-neutral-100" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {(snippets ?? []).map((snippet) => (
                    <SidebarMenuItem
                      key={snippet.id}
                      className="flex cursor-pointer justify-between"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              navigate(`/editor/${snippet.id}/${snippet.slug}`)
                            }}
                            className={cn(
                              'flex-1 cursor-pointer truncate rounded-md px-2 py-1.5 text-left transition-colors',
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
                      <div className="flex items-center gap-2 pr-2">
                        <SidebarMenuButton className="p-0">
                          <Pencil className={iconsStyles} />
                        </SidebarMenuButton>
                        <SidebarMenuButton className="p-0">
                          <Trash className={iconsStyles} />
                        </SidebarMenuButton>
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
