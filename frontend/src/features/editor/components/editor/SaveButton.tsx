import { TooltipButton } from '@/shared/components'
import { Save } from 'lucide-react'

const SaveButton = ({
  onClick,
  disabled,
}: React.ComponentProps<typeof TooltipButton>) => {
  return (
    <TooltipButton
      type="button"
      aria-label={'Save current snippet'}
      variant="outline"
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      className="min-w-24"
      tooltip={<p>Save current snippet</p>}
    >
      <span>Save</span>
      <Save aria-hidden="true" role="img" size={15} />
    </TooltipButton>
  )
}

export default SaveButton
