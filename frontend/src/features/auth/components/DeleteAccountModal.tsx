import { Modal } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'

type DeleteUserModalProps = {
  onCloseModal: () => void
  onDeleteUser: () => void
}

export default function DeleteUserModal({
  onCloseModal,
  onDeleteUser,
}: DeleteUserModalProps) {
  return (
    <Modal open title="Are you absolutely sure?" onOpenChange={onCloseModal}>
      <div className="relative mx-auto flex w-[400px] flex-col gap-6">
        <p className="text-sm">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCloseModal}>Cancel</Button>
          <Button variant="destructive" onClick={onDeleteUser}>
            Yes, delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
