import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarProvider,
} from '../../../shared/components/ui/sidebar'
import { useSuspenseQuery } from '@apollo/client'
import { GET_ALL_SNIPPETS } from '../../../shared/api/getUserSnippets'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'

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

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="h-screen w-64 bg-zinc-900">
        <SidebarContent>
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupContent>
              {snippets.length > 0 && (
                <SidebarMenu className="gap-3">
                  <SidebarMenuItem
                    key={'add-new-snippet'}
                    className={'rounded-md bg-neutral-700'}
                  >
                    <Plus className="h-4 w-4" />
                    <SidebarMenuButton
                      asChild
                      className="cursor-pointer"
                      isActive
                    ></SidebarMenuButton>
                  </SidebarMenuItem>
                  {snippets.map((snippet) => (
                    <SidebarMenuItem
                      key={snippet.id}
                      className={`rounded-md bg-neutral-700 ${
                        activeSnippetId === snippet.id
                          ? 'text-sky-500'
                          : 'text-neutral-300'
                      }`}
                    >
                      <SidebarMenuButton
                        asChild
                        className="cursor-pointer"
                        onClick={() => {
                          handleClick(snippet)
                        }}
                      >
                        <span>{snippet.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
