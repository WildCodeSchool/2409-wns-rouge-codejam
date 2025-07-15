import { PlayIcon, Share2Icon } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'

// !TODO: define custom accent color in taiwind theme...
const baseButtonStyle =
  'bg-primary/50 hover:text-accent focus-visible:text-accent border-[#7dd3fc] text-[#7dd3fc] hover:bg-radial hover:to-[#0369A1] hover:from-[#7DD3FC] focus-visible:border-[#7dd3fc] focus-visible:bg-radial focus-visible:to-[#0369A1] focus-visible:from-[#7DD3FC] hover:shadow-xl hover:shadow-[#0369A1] '

export default function EditorActions() {
  return (
    <div className="absolute top-4 right-6 z-10 flex flex-col gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            aria-label={'Run code'}
            variant="outline"
            size="icon"
            className={baseButtonStyle}
            onClick={() => {
              alert('🚧 Running code...')
            }}
          >
            <PlayIcon aria-hidden="true" role="img" size={15} />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="end">
          <p>Run code</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            aria-label={'Copy url to clipboard'}
            variant="outline"
            size="icon"
            className={baseButtonStyle}
            onClick={() => {
              alert('🚧 Copy current url to clipboard...')
            }}
          >
            <Share2Icon aria-hidden="true" role="img" size={15} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end">
          <p>Copy url to clipboard</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
