import { useEditorContext } from '@/features/editor/hooks'
import { resolveOutputBackgroundColor } from '@/features/editor/utils'
import { useModeContext } from '@/features/mode/hooks'

import { Skeleton } from '@/shared/components/ui/skeleton'
import { ExecutionStatus } from '@/shared/gql/graphql'
import { useIsMobile } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

const BASE_OUTPUT_CLASSES = 'font-editor w-full resize-none p-4 text-sm'
const BASE_STATUS_CLASSES = 'absolute right-2 top-2 rounded-full w-3 h-3'

type EditorOutputProps = {
  className?: string
}

export default function EditorOutput({ className }: EditorOutputProps) {
  const { isDarkMode } = useModeContext()
  const {
    editorState: { output, executionStatus },
  } = useEditorContext()

  const isError = !!executionStatus && executionStatus === ExecutionStatus.Error
  const isSuccess =
    !!executionStatus && executionStatus === ExecutionStatus.Success
  const outputValue =
    output || 'Click the "Run code" button to visualize the output here...'

  return (
    <div className={cn(className, !isDarkMode && 'border-input')}>
      <label htmlFor="editor-output" className="sr-only">
        Editor output
      </label>

      <textarea
        id="editor-output"
        readOnly
        value={outputValue}
        className={cn(
          BASE_OUTPUT_CLASSES,
          isError ? 'text-destructive' : 'text-foreground/50',
          output && 'text-foreground',
          isDarkMode ? 'border-transparent' : 'border-input',
          resolveOutputBackgroundColor(isDarkMode),
        )}
      />

      <div
        className={cn(
          BASE_STATUS_CLASSES,
          isError ? 'bg-error' : isSuccess ? 'bg-success' : 'bg-warning',
        )}
      />
    </div>
  )
}

export function EditorOutputSkeleton() {
  const isMobile = useIsMobile()
  const { isDarkMode } = useModeContext()

  return (
    <div
      className={cn(
        'relative flex h-full overflow-hidden rounded-md border border-transparent',
        !isMobile && 'mt-4',
      )}
    >
      <Skeleton
        className={cn(
          BASE_OUTPUT_CLASSES,
          isDarkMode ? 'border-transparent' : 'border-input',
          resolveOutputBackgroundColor(isDarkMode),
        )}
      />
    </div>
  )
}
