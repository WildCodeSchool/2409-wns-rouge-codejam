import { DeleteIcon, LogOutIcon } from 'lucide-react'
import { useState } from 'react'

import {
  AccountSettingsTrigger,
  DeleteAccountModal,
} from '@/features/auth/components'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useAppContext, useIsMobile } from '@/shared/hooks'

export default function AccountSettings() {
  const { loadingUser, user, logout, deleteAccount } = useAppContext()
  const [isOpenDeleteAccountModal, setOpenDeleteAccountModal] =
    useState<boolean>(false)

  if (loadingUser) {
    return <AccountSettingsSkeleton />
  }

  const openDeleteUserModal = () => {
    setOpenDeleteAccountModal(true)
  }
  const closeDeleteUserModal = () => {
    setOpenDeleteAccountModal(false)
  }

  const initialsToDisplay = user?.username?.slice(0, 2).toUpperCase() ?? 'CJ'

  return (
    <DropdownMenu>
      <AccountSettingsTrigger initials={initialsToDisplay} />

      <DropdownMenuContent className="w-56 text-sm" align="end">
        <DropdownMenuGroup className="my-4">
          <Avatar className="mx-auto mb-2 h-12 w-12 rounded-full">
            <AvatarImage src="/assets/images/avatar.jpeg" alt="" />
            <AvatarFallback>{initialsToDisplay}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-center">
            <span>{user?.username}</span>
            <span className="text-foreground/70 text-xs">{user?.email}</span>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="font-semibold">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuGroup className="mt-1 flex flex-col gap-1">
          <DropdownMenuItem asChild>
            <Button
              onClick={openDeleteUserModal}
              className="text-destructive hover:text-destructive! w-full cursor-pointer justify-start px-2! py-1.5"
              variant="ghost"
            >
              <DeleteIcon
                aria-hidden="true"
                size={15}
                className="text-destructive rotate-180"
              />
              <span>Delete My Account</span>
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              onClick={() => {
                void logout()
              }}
              className="w-full cursor-pointer justify-start px-2! py-1.5"
            >
              <LogOutIcon aria-hidden="true" size={15} className="rotate-180" />
              <span>Sign Out</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      {isOpenDeleteAccountModal && (
        <DeleteAccountModal
          onCloseModal={closeDeleteUserModal}
          onDeleteUser={deleteAccount}
        />
      )}
    </DropdownMenu>
  )
}

export function AccountSettingsSkeleton() {
  const isMobile = useIsMobile()
  if (isMobile) {
    return <Skeleton className="aspect-square w-9 rounded-full" />
  }
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="min-h-9 w-40 border border-transparent px-2 py-1" />
    </div>
  )
}
