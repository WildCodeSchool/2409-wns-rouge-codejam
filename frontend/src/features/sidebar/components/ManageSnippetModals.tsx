import { useMemo } from 'react'

import {
  DeleteSnippetModal,
  EditSnippetModal,
} from '@/features/sidebar/components'
import { useSidebarContext } from '@/features/sidebar/hooks'

import { useAppContext } from '@/shared/hooks'

export default function ManageSnippetModals() {
  const {
    edit,
    cancelDelete,
    cancelEdit,
    confirmDelete,
    createSnippet,
    isOpenDeleteModal,
    isOpenEditModal,
    renameSnippet,
    targetSnippetId,
  } = useSidebarContext()

  const { snippets } = useAppContext()

  const targetSnippet = useMemo(
    () => snippets.find((snippet) => snippet.id === targetSnippetId),
    [snippets, targetSnippetId],
  )

  return (
    <>
      <EditSnippetModal
        key={targetSnippet?.name} // 👈 re-mounts the modal whenever `targetSnippet` changes, ensuring the form resets and initializes with the latest snippet name (which may load asynchronously)
        open={isOpenEditModal}
        onOpenChange={cancelEdit}
        edit={edit}
        snippetName={targetSnippet?.name ?? ''}
        onCancel={cancelEdit}
        onConfirm={edit ? renameSnippet : createSnippet}
      />

      <DeleteSnippetModal
        title={`Delete snippet “${targetSnippet?.name ?? ''}”?`}
        open={isOpenDeleteModal}
        onOpenChange={cancelDelete}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  )
}
