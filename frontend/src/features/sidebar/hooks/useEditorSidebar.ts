import { useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EditorUrlParams } from '@/features/editor/types'

import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { useSidebar } from '@/shared/components/ui/sidebar'
import { Snippet } from '@/shared/gql/graphql'
import { useIsMobile } from '@/shared/hooks/use-mobile'

export default function useEditorSidebar() {
  const { snippetId } = useParams<EditorUrlParams>()
  const navigate = useNavigate()
  const [activeSnippetId, setActiveSnippetId] = useState<string | undefined>(
    snippetId,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()
  const { open, openMobile, setOpenMobile } = useSidebar()
  const { data: { whoAmI: user } = {} } = useQuery(WHO_AM_I)
  const { data: { getAllSnippets: snippets } = {} } = useQuery(
    GET_ALL_SNIPPETS,
    {
      skip: !user,
    },
  )

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

  const selectSnippet = useCallback(
    (snippetId: Snippet['id'], snippetSlug: Snippet['slug']) => {
      if (isMobile && openMobile) {
        setOpenMobile(false)
      }
      navigate(`/editor/${snippetId}/${snippetSlug}`)
    },
    [isMobile, openMobile, setOpenMobile, navigate],
  )

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const toggleModal = useCallback((nextOpen: boolean) => {
    setIsModalOpen(nextOpen)
  }, [])

  const isSidebarOpen = open || openMobile

  return useMemo(
    () => ({
      activeSnippetId,
      closeModal,
      isModalOpen,
      isSidebarOpen,
      navigate,
      openModal,
      selectSnippet,
      snippetId,
      snippets,
      toggleModal,
      user,
    }),
    [
      activeSnippetId,
      closeModal,
      isModalOpen,
      isSidebarOpen,
      navigate,
      openModal,
      selectSnippet,
      snippetId,
      snippets,
      toggleModal,
      user,
    ],
  )
}
