import { useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import { Skeleton } from '@/shared/components/ui/skeleton'
import DeleteUserModal from '@/features/auth/components/DeleteUserModal'

type UserInfoProps = {
  userName: string | null | undefined
  onSignOut: () => void
  onDeleteAccount: () => void
}

export default function UserInfo({
  userName,
  onSignOut,
  onDeleteAccount,
}: UserInfoProps) {
  const [isDeleteUserModalOpen, setOpenDeleteUserModal] =
    useState<boolean>(false)

  function handleOpenDeleteUserModal() {
    setOpenDeleteUserModal(true)
  }

  function handleCloseDeleteUserModal() {
    setOpenDeleteUserModal(false)
  }

  return (
    <div className="flex items-center gap-2">
      <p className="min-w-26 text-right">{userName ?? 'codejamer'}</p>

      <Popover>
        <Avatar>
          <PopoverTrigger
            aria-label="Show your account settings"
            className="cursor-pointer"
          >
            <AvatarImage src="/assets/images/avatar.jpeg" alt="" />
            <AvatarFallback>
              {userName?.slice(0, 2).toUpperCase() ?? 'CJ'}
            </AvatarFallback>
            <PopoverContent className="mr-4 grid w-fit gap-2">
              <Button onClick={onSignOut}>Sign Out</Button>
              <Button onClick={handleOpenDeleteUserModal} variant="destructive">
                Delete My Account
              </Button>
            </PopoverContent>
          </PopoverTrigger>
        </Avatar>
      </Popover>
      {isDeleteUserModalOpen && (
        <DeleteUserModal
          onCloseModal={handleCloseDeleteUserModal}
          onDeleteUser={onDeleteAccount}
        />
      )}
    </div>
  )
}

export function UserInfoSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 min-w-26" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  )
}
