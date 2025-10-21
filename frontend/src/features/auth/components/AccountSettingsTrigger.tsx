import { ChevronDownIcon } from 'lucide-react'

import { TooltipButton } from '@/shared/components'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { useAppContext, useIsMobile } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

type AccountSettingsTriggerProps = {
  initials: string
}

export default function AccountSettingsTrigger({
  initials,
}: AccountSettingsTriggerProps) {
  const isMobile = useIsMobile()
  const { user } = useAppContext()

  return (
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
          <AvatarFallback>{initials}</AvatarFallback>
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
  )
}
