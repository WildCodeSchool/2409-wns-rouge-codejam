import { Editor as MonacoEditor, EditorProps } from '@monaco-editor/react'

import { baseEditorOptions } from '@/features/editor/components/editor'
import { Spinner } from '@/shared/components/ui/spinner'

export default function Editor(props: EditorProps) {
  return (
    <div className="flex-1 overflow-hidden rounded-md border">
      <MonacoEditor
        {...props}
        loading={<Spinner />}
        className="[&_.margin]:pt-4 [&_.overflow-guard]:pt-4"
        options={{
          ...baseEditorOptions,
          wrappingIndent: 'indent',
          renderLineHighlight: 'gutter',
        }}
      />
    </div>
  )
}
