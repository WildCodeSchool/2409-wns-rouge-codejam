import Editor, { EditorProps } from '@monaco-editor/react'

import {
  baseEditorOptions,
  EditorActions,
} from '@/features/editor/components/editor'
import { Spinner } from '@/shared/components/ui/spinner'

export default function Output(props: EditorProps) {
  return (
    <div className="relative flex-1 overflow-hidden rounded-md">
      <Editor
        {...props}
        loading={<Spinner />}
        theme="vs-dark"
        className="[&_.margin]:pt-4 [&_.overflow-guard]:pt-4" // allocate space for action buttons (share and execute)
        options={{
          ...baseEditorOptions,
          readOnly: true,
          wrappingIndent: 'none',
          renderLineHighlight: 'none',
          lineNumbers: 'off',
        }}
      />

      <EditorActions />
    </div>
  )
}
