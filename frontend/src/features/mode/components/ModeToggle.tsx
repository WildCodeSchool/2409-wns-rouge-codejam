import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu'
import { LucideProps, MoonIcon, SunIcon, CogIcon } from 'lucide-react'

import { Mode, modeOptions } from '@/features/mode/contexts'
import { useMode } from '@/features/mode/hooks'

import { TooltipButton } from '@/shared/components'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'

const baseIconClasses = 'h-[1.2rem] w-[1.2rem] transition-all'
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
  const ToggleIcon = modeIcons[mode]

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <TooltipButton
          tooltip={`Change mode (${mode})`}
          variant="outline"
          size="icon"
          className="text-red rounded-full"
        >
          <ToggleIcon className={baseIconClasses} />
          <span className="sr-only">Change mode (current is {mode})</span>
        </TooltipButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="border-input bg-background min-w-[128px] rounded-md border p-1 shadow-xs"
      >
        {modeOptions.map((mode, index) => (
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ModeToggleSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-full" />
}
