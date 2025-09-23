import { PlayIcon, Share2Icon } from 'lucide-react'

import { Subscribe } from '@/features/editor/components/editor'
import { Modal, TooltipButton } from '@/shared/components'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useEditorRightActions } from '@/features/editor/hooks'
import { Spinner } from '@/shared/components/ui/spinner'

type EditorRightActionProps = {
  code: string
  language: Language
  onChangeOutput: (nextOutput: string) => void
  onChangeStatus: (nextStatus?: ExecutionStatus) => void
}

export default function EditorRightActions({
  code,
  language,
  onChangeOutput,
  onChangeStatus,
}: EditorRightActionProps) {
  const {
    executeSnippet,
    debouncedShareUrl,
    status,
    showModal,
    closeModal,
    snippetId,
  } = useEditorRightActions(code, language, onChangeOutput, onChangeStatus)

  const isExecuting = status === 'executing'
  const disabled = !code || isExecuting || status === 'disabled'

  return (
    <div className="flex justify-end gap-4">
      <TooltipButton
        tooltip="Execute current snippet"
        aria-disabled={disabled}
        disabled={disabled}
        onClick={executeSnippet}
        className="min-w-24"
      >
        <span>Run</span>
        {isExecuting ? (
          <Spinner show size="small" />
        ) : (
          <PlayIcon aria-hidden="true" role="img" size={15} />
        )}
      </TooltipButton>

      <TooltipButton
        tooltip="Copy url to clipboard"
        variant="outline"
        aria-disabled={!code}
        disabled={!code || !snippetId}
        onClick={debouncedShareUrl}
        className="min-w-24"
      >
        <span>Share</span>
        <Share2Icon aria-hidden="true" role="img" size={15} />
      </TooltipButton>

      {showModal && (
        <Modal
          open
          title="You've reached your daily execution limit!"
          onOpenChange={closeModal}
        >
          <Subscribe onRedirect={closeModal} />
        </Modal>
      )}
    </div>
  )
}

export function EditorRightActionsSkeleton() {
  return (
    <div className="ml-auto flex justify-end gap-4">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
    </div>
  )
}
