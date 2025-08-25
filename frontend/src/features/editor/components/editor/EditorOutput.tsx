import { twMerge } from 'tailwind-merge'

import { Skeleton } from '@/shared/components/ui/skeleton'
import { ExecutionStatus } from '@/shared/gql/graphql'

type EditorOutputProps = {
  output: string
  status?: ExecutionStatus
}

const baseStyle = 'font-editor w-full resize-none bg-[#1e1e1e] p-4 text-sm '

export default function EditorOutput({ output, status }: EditorOutputProps) {
  const isError = !!status && status === ExecutionStatus.Error
  const outputValue =
    output || 'Click the "Run code" button to visualize the output here...'

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

export function EditorOutputSkeleton() {
  return <Skeleton className="h-full bg-[#1e1e1e]" />
}
