import { useMutation, useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EditorUrlParams } from '@/features/editor/types'

import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { useSidebar } from '@/shared/components/ui/sidebar'
import {
  DeleteSnippetMutation,
  DeleteSnippetMutationVariables,
  Snippet,
} from '@/shared/gql/graphql'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { DELETE_SNIPPET } from '@/shared/api/deleteSnippet'
import { pickNeighborById } from '../utils'
import { toastOptions } from '@/shared/config'
import { toast } from 'sonner'

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
  // Delete mutation — refetch list
  const [deleteSnippet] = useMutation<
    DeleteSnippetMutation,
    DeleteSnippetMutationVariables
  >(DELETE_SNIPPET, {
    refetchQueries: [{ query: GET_ALL_SNIPPETS }],
    awaitRefetchQueries: true,
  })

  // Controlled modal: delete — stores the target snippet
  const [targetIdToDelete, setTargetIdToDelete] = useState<string | null>(null)

  useEffect(() => {
    let nextActiveSnippetId: string | undefined

    if (snippetId) {
      const matchSnippet = snippets?.find((s) => s.id === snippetId)
      nextActiveSnippetId =
        matchSnippet !== undefined ? matchSnippet.id : undefined
      if (!matchSnippet) {
        if (snippets && snippets.length > 0) {
          navigate(`/editor/${snippets[0].id}/${snippets[0].slug}`, {
            replace: true,
          })
        } else {
          navigate('/editor', { replace: true })
        }
      }
    } else {
      nextActiveSnippetId = snippets?.[0]?.id
      // Load first snippet (if any) when user signned in and there is no snippet in the url
      if (snippets && snippets.length > 0) {
        navigate(`/editor/${snippets[0].id}/${snippets[0]?.slug}`, {
          replace: true,
        })
      } else {
        navigate('/editor', { replace: true })
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

  const confirmDelete = useCallback(async (): Promise<boolean> => {
    if (!targetIdToDelete) return false

    // Compute neighbor BEFORE Apollo refetch changes the list (using the util)
    const neighbor = pickNeighborById(snippets ?? [], targetIdToDelete)

    const targetName =
      snippets?.find((s) => s.id === targetIdToDelete)?.name ?? 'Snippet'

    try {
      await deleteSnippet({ variables: { id: targetIdToDelete } })

      if (activeSnippetId === targetIdToDelete) {
        if (neighbor) {
          navigate(`/editor/${neighbor.id}/${neighbor.slug}`, {
            replace: true,
          })
        } else {
          navigate('/editor', { replace: true })
        }
      }

      toast.success(`“${targetName}” was deleted.`, {
        ...toastOptions.success,
      })
      setTargetIdToDelete(null)
      return true
    } catch {
      toast.error("Oops! We couldn't delete the snippet.", {
        ...toastOptions.error,
      })
      return false
    }
  }, [targetIdToDelete, deleteSnippet, activeSnippetId, navigate, snippets])

  // Derive the label from the current list + selected id
  const targetNameToDelete = useMemo(
    () => snippets?.find((s) => s.id === targetIdToDelete)?.name ?? '',
    [snippets, targetIdToDelete],
  )

  const isSidebarOpen = open || openMobile

  return useMemo(
    () => ({
      activeSnippetId,
      closeModal,
      confirmDelete,
      targetIdToDelete,
      targetNameToDelete,
      isModalOpen,
      isSidebarOpen,
      navigate,
      openModal,
      selectSnippet,
      setTargetIdToDelete,
      snippetId,
      snippets,
      toggleModal,
      user,
    }),
    [
      activeSnippetId,
      closeModal,
      confirmDelete,
      targetIdToDelete,
      targetNameToDelete,
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
