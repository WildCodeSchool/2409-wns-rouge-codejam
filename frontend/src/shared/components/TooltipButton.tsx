import { forwardRef } from 'react'

import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type TooltipButtonProps = React.ComponentProps<typeof Button> & {
  tooltip: string
}

const TooltipButton = forwardRef<HTMLButtonElement, TooltipButtonProps>(
  function TooltipButton({ children, tooltip, ...restProps }, ref) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button {...restProps} ref={ref} aria-label={tooltip}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    )
  },
)

export default TooltipButton
