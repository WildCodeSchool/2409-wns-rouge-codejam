import { resolveOutputBackgroundColor } from '@/features/editor/utils'
import { useMode } from '@/features/mode/hooks'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { ExecutionStatus } from '@/shared/gql/graphql'
import { cn } from '@/shared/lib/utils'

const baseContainerClasses =
  'relative flex h-full overflow-hidden rounded-md border border-transparent'
const baseOutputClasses = 'font-editor w-full resize-none p-4 text-sm'
const baseStatusClasses = 'absolute right-2 top-2 rounded-full w-3 h-3'

type EditorOutputProps = {
  output: string
  status?: ExecutionStatus
}

export default function EditorOutput({ output, status }: EditorOutputProps) {
  const { isDarkMode } = useMode()

  const isError = !!status && status === ExecutionStatus.Error
  const isSuccess = !!status && status === ExecutionStatus.Success
  const outputBackgroundColor = resolveOutputBackgroundColor(isDarkMode)

  const outputValue =
    output || 'Click the "Run code" button to visualize the output here...'

  return (
    <div className={cn(baseContainerClasses, !isDarkMode && 'border-input')}>
      <label htmlFor="editor-output" className="sr-only">
        Editor output
      </label>

      <textarea
        id="editor-output"
        readOnly
        value={outputValue}
        className={cn(
          baseOutputClasses,
          isError ? 'text-destructive' : 'text-foreground/50',
          output && 'text-foreground',
          isDarkMode ? 'border-transparent' : 'border-input',
          outputBackgroundColor,
        )}
      />

      <div
        className={cn(
          baseStatusClasses,
          isError ? 'bg-error' : isSuccess ? 'bg-success' : 'bg-warning',
        )}
      ></div>
    </div>
  )
}

export function EditorOutputSkeleton() {
  const { isDarkMode } = useMode()
  const outputBackgroundColor = resolveOutputBackgroundColor(isDarkMode)

  return <Skeleton className={cn('h-full', outputBackgroundColor)} />
}
