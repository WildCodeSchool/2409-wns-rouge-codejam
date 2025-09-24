import { TooltipButton } from '@/shared/components'
import { PlayIcon } from 'lucide-react'

const RunButton = ({
  onClick,
  disabled,
}: React.ComponentProps<typeof TooltipButton>) => {
  return (
    <TooltipButton
      type="button"
      aria-label={'Execute current snippet'}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      className="min-w-24"
      tooltip={<p>Execute current snippet</p>}
    >
      <span>Run</span>
      <PlayIcon aria-hidden="true" role="img" size={15} />
    </TooltipButton>
  )
}

export default RunButton
