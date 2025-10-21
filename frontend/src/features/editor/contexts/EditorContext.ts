import { createContext } from 'react'

import { EditorState } from '@/features/editor/reducers'
import { ExecutionStatus, GetSnippetQuery } from '@/shared/gql/graphql'

type EditorContextValue = {
  snippet: GetSnippetQuery['getSnippet'] | null | undefined
  editorState: EditorState
  updateCode: (nextCode?: string) => void
  updateLanguage: (nextLanguage: string) => void
  updateOutput: (nextOutput?: string) => void
  updateStatus: (nextStatus?: ExecutionStatus) => void
}

export const EditorContext = createContext<EditorContextValue | null>(null)
