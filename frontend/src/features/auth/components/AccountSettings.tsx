import { ChevronDownIcon, LogOutIcon } from 'lucide-react'

import { TooltipButton } from '@/shared/components'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Skeleton } from '@/shared/components/ui/skeleton'

type AccountSettingsProps = {
  username: string | null | undefined
  email: string | null | undefined
  onLogout: () => void
}

export default function AccountSettings({
  username,
  email,
  onLogout,
}: AccountSettingsProps) {
  const displayInitials = username?.slice(0, 2).toUpperCase() ?? 'CJ'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipButton
          tooltip="Show your account settings"
          variant="ghost"
          className="group border-input h-fit min-h-9 w-fit min-w-30 rounded-md border px-2 py-1"
        >
          <Avatar className="h-6 w-6 rounded-full">
            <AvatarImage src="/assets/images/avatar.jpeg" alt="" />
            <AvatarFallback>{displayInitials}</AvatarFallback>
          </Avatar>
          <span className="max-w-40 truncate text-right">{username}</span>
          <ChevronDownIcon
            aria-hidden="true"
            role="img"
            size={15}
            className="transition-transform group-data-[state=open]:rotate-180"
          />
        </TooltipButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 text-sm" align="end">
        <DropdownMenuGroup className="my-4">
          <Avatar className="mx-auto mb-2 h-12 w-12 rounded-full">
            <AvatarImage src="/assets/images/avatar.jpeg" alt="" />
            <AvatarFallback>{displayInitials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-center">
            <span>{username}</span>
            <span className="text-foreground/70 text-xs">{email}</span>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full cursor-pointer justify-start px-2! py-1.5"
          >
            <LogOutIcon
              aria-hidden="true"
              role="img"
              size={15}
              className="rotate-180"
            />
            <span>Sign Out</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AccountSettingsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="min-h-9 min-w-30 border border-transparent px-2 py-1" />
    </div>
  )
}
