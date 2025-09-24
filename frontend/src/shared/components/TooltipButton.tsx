import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type TooltipButtonProps = React.ComponentProps<typeof Button> & {
  tooltip: string
}

const TooltipButton = ({
  children,
  tooltip,
  ...restProps
}: TooltipButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...restProps} aria-label={tooltip}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export default TooltipButton
