import Editor, { EditorProps } from '@monaco-editor/react'

import { baseEditorOptions } from '@/features/editor/components/editor/config'
import { Spinner } from '@/shared/components/ui/spinner'

export default function Output(props: EditorProps) {
  return (
    <div className="flex-1 overflow-hidden rounded-md border">
      <Editor
        {...props}
        loading={<Spinner />}
        theme="vs-dark"
        options={{
          ...baseEditorOptions,
          readOnly: true, // Make the output editor read-only
        }}
      />
    </div>
  )
}
