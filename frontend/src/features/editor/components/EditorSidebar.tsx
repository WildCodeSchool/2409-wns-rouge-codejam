import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '../../../shared/components/ui/sidebar'
import { useSuspenseQuery } from '@apollo/client'
import { GET_ALL_SNIPPETS } from '../../../shared/api/getUserSnippets'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash } from 'lucide-react'
import CreateSnippetModal from '@/features/editor/components/CreateSnippetModal'
import Modal from '@/shared/components/Modal'

interface Snippet {
  id: string
  name: string
  slug: string
}

export default function EditorSidebar() {
  const { data } = useSuspenseQuery(GET_ALL_SNIPPETS) as {
    data: { getAllSnippets: Snippet[] }
  }
  const navigate = useNavigate()
  const location = useLocation()
  const snippets = data.getAllSnippets
  const [activeSnippetId, setActiveSnippetId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // On mount and when location/snippets change, sync activeSnippetId with URL or default to first snippet
  useEffect(() => {
    const match = /^\/([^/]+)/.exec(location.pathname)
    if (match && snippets.some((s) => s.id === match[1])) {
      setActiveSnippetId(match[1])
    } else if (snippets.length > 0) {
      setActiveSnippetId(snippets[0].id)
      navigate(`/${snippets[0].id}/${snippets[0].slug}`, { replace: true })
    }
  }, [location.pathname, snippets, navigate])

  const handleClick = (snippet: Snippet) => {
    setActiveSnippetId(snippet.id)
    navigate(`/${snippet.id}/${snippet.slug}`)
  }

  const hoveredTextStyles = 'text-neutral-300 hover:text-neutral-100'
  const iconsStyles = `cursor-pointer h-4 w-4 ${hoveredTextStyles}`

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="none"
        className="bg-sidebar-foreground h-screen max-w-[300px]"
      >
        <SidebarContent>
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupContent>
              {snippets.length > 0 && (
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
                  {snippets.map((snippet) => (
                    <SidebarMenuItem
                      key={snippet.id}
                      className="flex cursor-pointer justify-between"
                    >
                      <SidebarMenuButton
                        asChild
                        onClick={() => {
                          handleClick(snippet)
                        }}
                        className={
                          activeSnippetId === snippet.id
                            ? 'text-sky-500 hover:text-sky-300'
                            : hoveredTextStyles
                        }
                      >
                        <span>{snippet.name}</span>
                      </SidebarMenuButton>
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
          onClose={() => {
            setIsModalOpen(false)
          }}
        />
      </Modal>
    </SidebarProvider>
  )
}
