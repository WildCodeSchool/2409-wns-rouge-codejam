import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import {
  CodeEditor,
  EditorActions,
  EditorOutput,
  LanguageSelect,
  STARTER_SNIPPET,
} from '@/features/editor/components/editor'
import { EditorUrlParams } from '@/features/editor/types'

import { GET_SNIPPET } from '@/shared/api/getSnippet'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { Spinner } from '@/shared/components/ui/spinner'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'

export default function EditorPage() {
  const [language, setLanguage] = useState<Language>(Language.Javascript)
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [status, setStatus] = useState<ExecutionStatus | undefined>(undefined)
  const { snippetId } = useParams<EditorUrlParams>()
  const {
    data: { getSnippet: snippet } = {},
    error,
    loading,
  } = useQuery(GET_SNIPPET, {
    ...(snippetId ? { variables: { id: snippetId } } : {}),
    skip: !snippetId,
  })

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

  // Initialize code with starter snippet or existing snippet code
  useEffect(() => {
    if (!snippetId) {
      setCode(STARTER_SNIPPET[language])
      return
    }
    const initialSnippetCode = snippet?.code ?? ''
    setCode(initialSnippetCode)
  }, [snippetId, snippet, language])

  if (loading) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner size="large" />
      </div>
    )
  }
  if (error) {
    return (
      <div className="grid h-full place-items-center">
        <p>
          Oops the editor is momentarily unavailable... Please try again later.
        </p>
      </div>
    )
  }

  // If snippetId is provided but no snippet found, redirect to home
  if (snippet === null) {
    toast.error('Snippet not found', { description: 'Redirecting to home...' })
    return <Navigate to="/" replace />
  }

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className="grid grid-rows-[auto_1fr] gap-2"
        >
          <LanguageSelect language={language} onChange={handleSelectLanguage} />

          <CodeEditor
            code={code}
            language={language}
            onChange={handleChangeCode}
          />
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-transparent" />

        <ResizablePanel
          defaultSize={50}
          maxSize={75}
          minSize={25}
          className="grid grid-rows-[auto_1fr] gap-2"
        >
          <EditorActions
            code={code}
            language={language}
            onChangeResult={handleChangeResult}
            onChangeStatus={handleChangeStatus}
          />
          <EditorOutput result={result} status={status} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
