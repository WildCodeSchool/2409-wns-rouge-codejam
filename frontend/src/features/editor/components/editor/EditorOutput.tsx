import { twMerge } from 'tailwind-merge'

import { ExecutionStatus } from '@/shared/gql/graphql'

type EditorOutputProps = {
  result: string
  status?: ExecutionStatus
}

const baseStyle = 'font-editor w-full resize-none bg-[#1e1e1e] p-4 text-sm '

export default function EditorOutput({ result, status }: EditorOutputProps) {
  const isError = !!status && status === ExecutionStatus.Error
  const outputValue =
    result || 'Click the "Run code" button to visualize the output here...'

  return (
    <div className="flex h-full overflow-hidden rounded-md">
      <label htmlFor="editor-output" className="sr-only">
        Editor output
      </label>
      <textarea
        id="editor-output"
        readOnly
        value={outputValue}
        className={twMerge(
          baseStyle,
          isError ? 'text-red-400' : 'text-[#d4d4d4]',
        )}
      />
    </div>
  )
}
