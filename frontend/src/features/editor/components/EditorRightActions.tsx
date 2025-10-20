import { PlayIcon, Share2Icon } from 'lucide-react'

import { Subscribe } from '@/features/editor/components'
import { useEditorRightActions } from '@/features/editor/hooks'
import { Modal, TooltipButton } from '@/shared/components'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Spinner } from '@/shared/components/ui/spinner'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'

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
  const isMobile = useIsMobile()
  const {
    debouncedRunSnippet,
    debouncedShareUrl,
    RUN_SNIPPET_SHORTCUT,
    SHARE_SNIPPET_SHORTCUT,
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
        tooltip={`Execute current snippet (⌘⇧${RUN_SNIPPET_SHORTCUT.toLowerCase().replace(/Key/i, '').toUpperCase()})`}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={debouncedRunSnippet}
        className={cn(
          'min-w-24',
          isMobile && 'aspect-square min-w-[unset] rounded-full px-2!',
        )}
      >
        {!isMobile && <span>Run</span>}
        {isExecuting ? (
          <Spinner show size="small" />
        ) : (
          <PlayIcon aria-hidden="true" size={15} />
        )}
      </TooltipButton>

      <TooltipButton
        tooltip={`Copy url to clipboard (⌘⇧${SHARE_SNIPPET_SHORTCUT.toLowerCase().replace(/Key/i, '').toUpperCase()})`}
        variant="outline"
        aria-disabled={!code}
        disabled={!code || !snippetId}
        onClick={debouncedShareUrl}
        className={cn(
          'min-w-24',
          isMobile && 'aspect-square min-w-[unset] rounded-full px-2!',
        )}
      >
        {!isMobile && <span>Share</span>}
        <Share2Icon aria-hidden="true" size={15} />
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
  const isMobile = useIsMobile()

  return (
    <div className="flex justify-end gap-4">
      <Skeleton className={cn('h-9', isMobile ? 'w-9 rounded-full' : 'w-24')} />
      <Skeleton className={cn('h-9', isMobile ? 'w-9 rounded-full' : 'w-24')} />
    </div>
  )
}
