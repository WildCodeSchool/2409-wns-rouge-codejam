import { createContext } from 'react'

import { ExecutionStatus, Language } from '@/shared/gql/graphql'

type EditorContextType = {
  code: string
  language: Language
  result: string
  status: ExecutionStatus | undefined
  handleChangeCode: (nextCode?: string) => void
  handleSelectLanguage: (nextLanguage: string) => void
  handleChangeResult: (nextResult: string) => void
  handleChangeStatus: (nextStatus: ExecutionStatus | undefined) => void
}

export const EditorContext = createContext<EditorContextType | null>(null)
