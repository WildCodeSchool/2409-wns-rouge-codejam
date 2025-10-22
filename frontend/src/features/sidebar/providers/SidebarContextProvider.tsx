import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { SnippetEditType } from '@/features/auth/schemas'
import { useEditorContext } from '@/features/editor/hooks'
import { EditorUrlParams } from '@/features/editor/types'
import { SidebarContext } from '@/features/sidebar/contexts'
import { pickNeighborById } from '@/features/sidebar/utils'

import { CREATE_SNIPPET } from '@/shared/api/createSnippet'
import { DELETE_SNIPPET } from '@/shared/api/deleteSnippet'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { UPDATE_SNIPPET } from '@/shared/api/updateSnippet'
import { useSidebar } from '@/shared/components/ui/sidebar'
import { TOAST_OPTIONS } from '@/shared/config'
import {
  CreateSnippetMutation,
  DeleteSnippetMutation,
  DeleteSnippetMutationVariables,
  Snippet,
  UpdateSnippetMutation,
} from '@/shared/gql/graphql'
import { useAppContext, useIsMobile } from '@/shared/hooks'

export default function SidebarContextProvider({
  children,
}: React.PropsWithChildren) {
  const { snippets } = useAppContext()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const {
    editorState: { language },
  } = useEditorContext()
  const { snippetId } = useParams<EditorUrlParams>()
  const { open, openMobile, setOpenMobile } = useSidebar()
  const [edit, setEdit] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [targetSnippetId, setTargetSnippetId] = useState<Snippet['id'] | null>(
    null,
  )

  const [deleteSnippetMutation] = useMutation<
    DeleteSnippetMutation,
    DeleteSnippetMutationVariables
  >(DELETE_SNIPPET, {
    refetchQueries: [{ query: GET_ALL_SNIPPETS }],
    awaitRefetchQueries: true,
  })
  const [createSnippetMutation] =
    useMutation<CreateSnippetMutation>(CREATE_SNIPPET)
  const [renameSnippetMutation] =
    useMutation<UpdateSnippetMutation>(UPDATE_SNIPPET)

  const cancelDelete = useCallback(() => {
    setTargetSnippetId(null)
    setIsOpenDeleteModal(false)
  }, [])

  const cancelEdit = useCallback(() => {
    setTargetSnippetId(null)
    setIsOpenEditModal(false)
  }, [])

  const confirmDelete = useCallback(async (): Promise<void> => {
    if (!targetSnippetId) {
      return
    }

    // Compute neighbor BEFORE Apollo refetch changes the list (using the util)
    const neighbor = pickNeighborById(snippets, targetSnippetId)

    try {
      await deleteSnippetMutation({ variables: { id: targetSnippetId } })

      setTargetSnippetId(null)
      setIsOpenDeleteModal(false)

      if (snippetId && snippetId === targetSnippetId) {
        if (neighbor) {
          navigate(`/editor/${neighbor.id}/${neighbor.slug}`, {
            replace: true,
          })
        } else {
          navigate('/editor', { replace: true })
        }
      }

      toast.success('Snippet deleted successfully', {
        ...TOAST_OPTIONS.success,
      })
    } catch {
      toast.error("Oops! We couldn't delete your snippet...", {
        ...TOAST_OPTIONS.error,
      })
    }
  }, [targetSnippetId, deleteSnippetMutation, snippetId, navigate, snippets])

  const createSnippet = useCallback(
    async (values: SnippetEditType) => {
      try {
        const snippet = await createSnippetMutation({
          variables: {
            data: {
              name: values.name,
              code: '',
              language,
            },
          },
          refetchQueries: [GET_ALL_SNIPPETS],
          awaitRefetchQueries: true,
        })

        if (snippet.data?.createSnippet) {
          console.log(
            'navigatig to new snippet...',
            snippet.data.createSnippet.name,
          )
          navigate(
            `/editor/${snippet.data.createSnippet.id}/${snippet.data.createSnippet.slug}`,
          )
        }

        toast.success(`Snippet created successfully`, {
          ...TOAST_OPTIONS.success,
        })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : JSON.stringify(err)
        console.error(errorMessage)
        toast.error("Oops! We couldn't create your snippet...", {
          ...TOAST_OPTIONS.error,
          description: errorMessage,
        })
      }
    },
    [createSnippetMutation, language, navigate],
  )

  const openDeleteModal = useCallback(() => {
    setIsOpenDeleteModal(true)
  }, [])

  const openEditModal = useCallback(() => {
    setIsOpenEditModal(true)
  }, [])

  const renameSnippet = useCallback(
    async (values: SnippetEditType) => {
      try {
        const snippet = await renameSnippetMutation({
          variables: {
            data: {
              name: values.name,
            },
            updateSnippetId: targetSnippetId,
          },
          refetchQueries: [GET_ALL_SNIPPETS],
        })

        if (snippet.data && targetSnippetId === snippetId) {
          navigate(
            `/editor/${snippet.data.updateSnippet.id}/${snippet.data.updateSnippet.slug}`,
          )
        }
        toast.success(`Snippet renamed successfully`, {
          ...TOAST_OPTIONS.success,
        })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : JSON.stringify(err)
        console.error(errorMessage)
        toast.error("Oops! We couldn't rename your snippet...", {
          ...TOAST_OPTIONS.error,
          description: errorMessage,
        })
      }
    },
    [renameSnippetMutation, targetSnippetId, navigate, snippetId],
  )

  const selectSnippet = useCallback(
    (snippetId: Snippet['id'], snippetSlug: Snippet['slug']) => {
      if (isMobile && openMobile) {
        setOpenMobile(false)
      }
      navigate(`/editor/${snippetId}/${snippetSlug}`)
    },
    [isMobile, openMobile, setOpenMobile, navigate],
  )

  const selectTargetSnippet = useCallback((snippetId: Snippet['id'] | null) => {
    setTargetSnippetId(snippetId)
  }, [])

  const isSidebarOpen = open || openMobile

  const ctx = {
    cancelDelete,
    cancelEdit,
    confirmDelete,
    createSnippet,
    edit,
    isOpenDeleteModal,
    isOpenEditModal,
    isSidebarOpen,
    openDeleteModal,
    openEditModal,
    renameSnippet,
    selectSnippet,
    selectTargetSnippet,
    setEdit,
    targetSnippetId,
  }

  return (
    <SidebarContext.Provider value={ctx}>{children}</SidebarContext.Provider>
  )
}
