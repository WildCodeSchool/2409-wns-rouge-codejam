import { useState } from 'react'
import { Subscribe } from '@/features/editor/components/editor'
import { Modal } from '@/shared/components'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'
import { Skeleton } from '@/shared/components/ui/skeleton'
import RunButton from './RunButton'
import ShareButton from './ShareButton'
import useEditorRightActions from '../../hooks/useEditorRightActions'

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
  const [showModal, setShowModal] = useState(false)
  const { executeSnippet, shareSnippet, status } = useEditorRightActions(
    onChangeOutput,
    onChangeStatus,
  )

  const isExecuting = status === 'executing'
  const disabled = !code || isExecuting || status === 'disabled'

  const handleExecute = async () => {
    await executeSnippet(code, language)
  }
  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className="flex justify-end gap-4">
      <RunButton
        onClick={handleExecute}
        disabled={disabled}
        loading={isExecuting}
      />
      <ShareButton disabled={!code} onClick={shareSnippet} />
      {showModal && (
        <Modal
          open
          title="You've reached your daily execution limit!"
          onOpenChange={handleCloseModal}
        >
          <Subscribe onRedirect={handleCloseModal} />
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
