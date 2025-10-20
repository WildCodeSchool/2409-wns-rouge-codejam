import { ChevronDownIcon, LogOutIcon } from 'lucide-react'

import { useAuth } from '@/features/auth/hooks'
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
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'

export default function AccountSettings() {
  const { user, loading, logout } = useAuth()
  const isMobile = useIsMobile()

  const displayInitials = user?.username?.slice(0, 2).toUpperCase() ?? 'CJ'

  if (loading) {
    return <AccountSettingsSkeleton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipButton
          tooltip="Show your account settings"
          variant="ghost"
          className={cn(
            'group border-input h-fit min-h-9 w-40 rounded-md border py-1',
            isMobile && 'aspect-square w-fit rounded-full p-0',
          )}
        >
          <Avatar className="h-6 w-6 rounded-full">
            <AvatarImage src="/assets/images/avatar.jpeg" alt="" />
            <AvatarFallback>{displayInitials}</AvatarFallback>
          </Avatar>
          {!isMobile && (
            <>
              <span className="max-w-25 flex-1 truncate text-left">
                {user?.username}
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                size={15}
                className="transition-transform group-data-[state=open]:rotate-180"
              />
            </>
          )}
        </TooltipButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 text-sm" align="end">
        <DropdownMenuGroup className="my-4">
          <Avatar className="mx-auto mb-2 h-12 w-12 rounded-full">
            <AvatarImage src="/assets/images/avatar.jpeg" alt="" />
            <AvatarFallback>{displayInitials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-center">
            <span>{user?.username}</span>
            <span className="text-foreground/70 text-xs">{user?.email}</span>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>Profile</DropdownMenuItem>

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
      </DropdownMenuContent>
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
