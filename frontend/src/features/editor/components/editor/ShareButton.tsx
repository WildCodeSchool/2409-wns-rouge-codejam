import { Button } from '@/shared/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { Share2Icon } from 'lucide-react'

type ShareButtonProps = {
  onClick: () => void
  disabled: boolean
}

const ShareButton = ({ onClick, disabled }: ShareButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          aria-label={'Copy url to clipboard'}
          variant="outline"
          aria-disabled={disabled}
          disabled={disabled}
          onClick={onClick}
          className="min-w-24"
        >
          <span>Share</span>
          <Share2Icon aria-hidden="true" role="img" size={15} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy url to clipboard</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default ShareButton
