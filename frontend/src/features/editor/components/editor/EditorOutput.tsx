import { twMerge } from 'tailwind-merge'

import { Skeleton } from '@/shared/components/ui/skeleton'
import { ExecutionStatus } from '@/shared/gql/graphql'

const baseOutputStyle =
  'font-editor w-full resize-none bg-[#1e1e1e] p-4 text-sm '

const baseStatusStyle = 'absolute right-2 top-2 rounded-full w-3 h-3'

type EditorOutputProps = {
  output: string
  status?: ExecutionStatus
}

export default function EditorOutput({ output, status }: EditorOutputProps) {
  const isError = !!status && status === ExecutionStatus.Error
  const isSuccess = !!status && status === ExecutionStatus.Success

  const outputValue =
    output || 'Click the "Run code" button to visualize the output here...'

  return (
    <div className="relative flex h-full overflow-hidden rounded-md">
      <label htmlFor="editor-output" className="sr-only">
        Editor output
      </label>

      <textarea
        id="editor-output"
        readOnly
        value={outputValue}
        className={twMerge(
          baseOutputStyle,
          isError ? 'text-red-400' : 'text-[#d4d4d4]',
        )}
      />

      <div
        className={twMerge(
          baseStatusStyle,
          isError ? 'bg-red-400' : isSuccess ? 'bg-green-400' : 'bg-amber-400',
        )}
      ></div>
    </div>
  )
}

export function EditorOutputSkeleton() {
  return <Skeleton className="h-full bg-[#1e1e1e]" />
}
