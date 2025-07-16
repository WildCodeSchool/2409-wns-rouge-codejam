import { useState } from 'react'

import { STARTER_SNIPPET } from '@/features/editor/components/editor'
import { EditorContext } from '@/features/editor/contexts'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'

export default function EditorContextProvider({
  children,
}: React.PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(Language.Javascript)
  const [code, setCode] = useState(STARTER_SNIPPET[language])
  const [result, setResult] = useState('')
  const [status, setStatus] = useState<ExecutionStatus | undefined>(undefined)

  const handleSelectLanguage = (nextLanguage: string) => {
    setLanguage(nextLanguage.toUpperCase() as Language)
    setCode(STARTER_SNIPPET[nextLanguage.toUpperCase() as Language])
  }
  const handleChangeCode = (nextCode?: string) => {
    if (nextCode === undefined) {
      setCode('')
    } else {
      setCode(nextCode)
    }
  }
  const handleChangeResult = (nextResult: string) => {
    setResult(nextResult)
  }
  const handleChangeStatus = (nextStatus: ExecutionStatus | undefined) => {
    setStatus(nextStatus)
  }

  const ctx = {
    code,
    language,
    result,
    status,
    handleChangeCode,
    handleSelectLanguage,
    handleChangeResult,
    handleChangeStatus,
  }

  return <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>
}
