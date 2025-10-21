import { LucideProps, MoonIcon, SunIcon, CogIcon } from 'lucide-react'

import { useMode } from '@/features/mode/hooks'
import { Mode, MODE_OPTIONS } from '@/features/mode/types'
import { TooltipButton } from '@/shared/components'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'

const baseItemClasses =
  'hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md px-2 py-1.5 text-sm tracking-wide outline-none'

const modeIcons: Record<Mode, React.FC<LucideProps>> = {
  light: ({ className, ...restProps }) => (
    <SunIcon
      {...restProps}
      className={cn(
        'scale-100 rotate-0 dark:scale-0 dark:-rotate-90',
        className,
      )}
    />
  ),
  dark: ({ className, ...restProps }) => (
    <MoonIcon
      {...restProps}
      className={cn(
        'dark-only:scale-100 dark-only:rotate-0 absolute scale-0 rotate-90',
        className,
      )}
    />
  ),
  system: ({ className, ...restProps }) => (
    <CogIcon
      {...restProps}
      className={cn(
        'system:scale-100 system:rotate-0 absolute scale-0 rotate-90',
        className,
      )}
    />
  ),
}

export default function ModeToggle() {
  const { mode, changeMode } = useMode()
  const isMobile = useIsMobile()

  const ToggleIcon = modeIcons[mode]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipButton
          tooltip={`Change mode (${mode})`}
          variant="outline"
          className={cn(
            'rounded-md',
            isMobile && 'aspect-square rounded-full px-2!',
          )}
        >
          {!isMobile && (
            <span>{mode.slice(0, 1).toUpperCase() + mode.slice(1)}</span>
          )}
          <ToggleIcon
            aria-hidden="true"
            size={15}
            className="relative transition-all"
          />
        </TooltipButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="border-input bg-background min-w-[128px] rounded-md border p-1 text-sm shadow-xs"
      >
        <DropdownMenuGroup>
          {MODE_OPTIONS.map((mode, index) => (
            <DropdownMenuItem
              key={index}
              className={baseItemClasses}
              onClick={() => {
                changeMode(mode)
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
