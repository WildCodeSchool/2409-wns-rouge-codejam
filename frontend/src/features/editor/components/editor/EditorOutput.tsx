import Editor from '@monaco-editor/react'
import { twMerge } from 'tailwind-merge'

import { BASE_EDITOR_OPTIONS } from '@/features/editor/components/editor'
import { Spinner } from '@/shared/components/ui/spinner'
import { ExecutionStatus } from '@/shared/gql/graphql'

type EditorOutputProps = {
  result: string
  status?: ExecutionStatus
}

// Allocate space for action buttons (share and execute)
const baseStyle = '[&_.margin]:pt-4 [&_.overflow-guard]:pt-4'

export default function EditorOutput({ result, status }: EditorOutputProps) {
  const isError = !!status && status === ExecutionStatus.Error
  const outputValue =
    result || 'Click the "Run code" button to visualize the output here...'

  return (
    <div className="flex h-full overflow-hidden rounded-md">
      <Editor
        value={outputValue}
        loading={<Spinner />}
        theme="vs-dark"
        options={{
          ...BASE_EDITOR_OPTIONS,
          readOnly: true,
          wrappingIndent: 'none',
          renderLineHighlight: 'none',
          lineNumbers: 'off',
          wordWrapColumn: 80, // disable word wrap columns
        }}
        className={twMerge(
          baseStyle,
          isError ? '[&_.view-line_span]:text-red-500!' : '',
        )}
      />
    </div>
  )
}
