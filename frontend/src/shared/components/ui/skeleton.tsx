import { cn } from '@/shared/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'shimmer animate-shimmer rounded-md bg-[#1e1e1e]',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
