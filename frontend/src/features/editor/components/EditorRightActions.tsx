import { PlayIcon, Share2Icon } from 'lucide-react'

import { Subscribe } from '@/features/editor/components'
import { useEditorRightActions } from '@/features/editor/hooks'

import { Modal, TooltipButton } from '@/shared/components'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Spinner } from '@/shared/components/ui/spinner'
import { useIsMobile } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

const BASE_BUTTON_CLASSES = 'min-w-24'
const MOBILE_BUTTON_CLASSES = 'aspect-square min-w-[unset] rounded-full px-2!'

const BASE_SKELETON_CLASSES = cn('h-9 ', BASE_BUTTON_CLASSES)
const MOBILE_SKELETON_CLASSES = 'w-9 rounded-full'

export default function EditorRightActions() {
  const {
    closeModal,
    code,
    debouncedRunSnippet,
    debouncedShareUrl,
    isMobile,
    RUN_SNIPPET_SHORTCUT,
    SHARE_SNIPPET_SHORTCUT,
    status,
    showModal,
    snippetId,
  } = useEditorRightActions()

  const isExecuting = status === 'executing'
  const disabled = !code || isExecuting || status === 'disabled'

  return (
    <div className="flex justify-end gap-4">
      <TooltipButton
        tooltip={`Execute current snippet (⌘⇧${RUN_SNIPPET_SHORTCUT.toLowerCase().replace(/Key/i, '').toUpperCase()})`}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={debouncedRunSnippet}
        className={cn(BASE_BUTTON_CLASSES, isMobile && MOBILE_BUTTON_CLASSES)}
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
        className={cn(BASE_BUTTON_CLASSES, isMobile && MOBILE_BUTTON_CLASSES)}
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
      <Skeleton
        className={cn(
          BASE_SKELETON_CLASSES,
          isMobile && MOBILE_SKELETON_CLASSES,
        )}
      />
      <Skeleton
        className={cn(
          BASE_SKELETON_CLASSES,
          isMobile && MOBILE_SKELETON_CLASSES,
        )}
      />
    </div>
  )
}
