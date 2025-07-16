import Editor from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useRef } from 'react'

import { BASE_EDITOR_OPTIONS } from '@/features/editor/components/editor'
import { useEditorContext } from '@/features/editor/hooks'
import { Spinner } from '@/shared/components/ui/spinner'

const defaultValue = '// Write your code here...'

export default function CodeEditor() {
  const { code, language, handleChangeCode } = useEditorContext()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  // Focus the editor when it mounts and set the cursor position at the end of the code
  const handleOnEditorMount = (
    editorInstance: editor.IStandaloneCodeEditor,
  ) => {
    editorRef.current = editorInstance
    editorInstance.focus()
    const position = editorInstance.getPosition()
    if (position) {
      const nextColumnPosition =
        (code.length > 0 ? code : defaultValue).length + 1
      editorInstance.setPosition({
        lineNumber: position.lineNumber,
        column: nextColumnPosition, // set cursor at the end of the default text
      })
    }
  }

  return (
    <div className="flex h-full overflow-hidden rounded-md border">
      <Editor
        defaultLanguage="javascript"
        defaultValue={defaultValue}
        language={language.toLowerCase()}
        value={code}
        onChange={handleChangeCode}
        onMount={handleOnEditorMount}
        loading={<Spinner />}
        theme="vs-dark"
        options={{
          ...BASE_EDITOR_OPTIONS,
          wrappingIndent: 'indent',
          renderLineHighlight: 'gutter',
        }}
        className="[&_.margin]:pt-4 [&_.overflow-guard]:pt-4"
      />
    </div>
  )
}
