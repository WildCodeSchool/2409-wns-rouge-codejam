import Editor from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useRef } from 'react'

import { BASE_EDITOR_OPTIONS } from '@/features/editor/components/editor'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Language } from '@/shared/gql/graphql'

type CodeEditorProps = {
  code: string
  language: Language
  onChange: (nextCode?: string) => void
}

export default function CodeEditor({
  code,
  language,
  onChange,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  // Focus the editor when it mounts and set the cursor position at the end of the code
  const handleOnEditorMount = (
    editorInstance: editor.IStandaloneCodeEditor,
  ) => {
    editorRef.current = editorInstance

    // Focus the editor and
    editorInstance.focus()

    // Set the cursor position at the end of the code
    const model = editorInstance.getModel()
    if (!model) {
      return
    }
    const lastLine = model.getLineCount()
    const position = editorInstance.getPosition()
    if (position) {
      const nextLinePosition = lastLine - 1
      const nextColumnPosition = code.length > 0 ? code.length + 1 : 0
      editorInstance.setPosition({
        lineNumber: nextLinePosition,
        column: nextColumnPosition,
      })
    }
  }

  return (
    <div className="flex h-full overflow-hidden rounded-md border">
      <Editor
        defaultLanguage="javascript"
        language={language.toLowerCase()}
        value={code}
        onChange={onChange}
        onMount={handleOnEditorMount}
        loading={<Skeleton className="h-full w-full" />}
        theme="vs-dark"
        options={{
          ...BASE_EDITOR_OPTIONS,
          wrappingIndent: 'indent',
          renderLineHighlight: 'gutter',
        }}
      />
    </div>
  )
}

export function CodeEditorSkeleton() {
  return <Skeleton className="h-full" />
}
