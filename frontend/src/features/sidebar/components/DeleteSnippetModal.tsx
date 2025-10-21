import { Modal } from '@/shared/components'
import { ModalProps } from '@/shared/components/Modal'
import { Button } from '@/shared/components/ui/button'

type DeleteSnippetModalProps = ModalProps & {
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteSnippetModal({
  title,
  open,
  onOpenChange,
  onCancel,
  onConfirm,
}: DeleteSnippetModalProps) {
  return (
    <Modal title={title} open={open} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        <p>This action is irreversible.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
