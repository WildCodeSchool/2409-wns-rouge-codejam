import TooltipButton from '@/shared/components/TooltipButton'
import { Share2Icon } from 'lucide-react'

const ShareButton = ({
  onClick,
  disabled,
}: React.ComponentProps<typeof TooltipButton>) => {
  return (
    <TooltipButton
      type="button"
      aria-label={'Copy url to clipboard'}
      variant="outline"
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      className="min-w-24"
      tooltip={<p>Copy url to clipboard</p>}
    >
      <span>Share</span>
      <Share2Icon aria-hidden="true" role="img" size={15} />
    </TooltipButton>
  )
}

export default ShareButton
