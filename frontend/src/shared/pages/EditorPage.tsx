import { useState } from 'react'

import {
  CodeEditor,
  EditorActions,
  EditorOutput,
  LanguageSelect,
  STARTER_SNIPPET,
} from '@/features/editor/components/editor'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'

export default function EditorPage() {
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
