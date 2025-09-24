import { Button } from './components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './components/ui/tooltip'

type TooltipButtonProps = React.ComponentProps<typeof Button> & {
  tooltip: React.ReactNode
}

const TooltipButton = ({
  children,
  tooltip,
  ...restProps
}: TooltipButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...restProps}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export default TooltipButton
