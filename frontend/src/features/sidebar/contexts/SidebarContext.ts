import { createContext } from 'react'

import { SnippetEditType } from '@/features/auth/schemas'

import { Snippet, Snippet as TSnippet } from '@/shared/gql/graphql'

type SidebarContextValue = {
  cancelDelete: () => void
  cancelEdit: () => void
  confirmDelete: () => Promise<void>
  createSnippet: (values: SnippetEditType) => Promise<void>
  edit: boolean
  isOpenDeleteModal: boolean
  isOpenEditModal: boolean
  isSidebarOpen: boolean
  openDeleteModal: () => void
  openEditModal: () => void
  renameSnippet: (values: SnippetEditType) => Promise<void>
  selectSnippet: (
    snippetId: TSnippet['id'],
    snippetSlug: TSnippet['slug'],
  ) => void
  selectTargetSnippet: (snippetId: TSnippet['id'] | null) => void
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
  targetSnippetId: Snippet['id'] | null
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)
