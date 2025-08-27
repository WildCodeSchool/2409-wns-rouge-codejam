import { Button } from '@/shared/components/ui/button'
import { Spinner } from '@/shared/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { PlayIcon } from 'lucide-react'

type RunButtonProps = {
  onClick: (_e: React.MouseEvent<HTMLButtonElement>) => void
  loading: boolean
  disabled: boolean
}

const RunButton = ({ onClick, loading, disabled }: RunButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          aria-label={'Execute current snippet'}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={onClick}
          className="min-w-24"
        >
          <span>Run</span>
          {loading ? (
            <Spinner size="small" />
          ) : (
            <PlayIcon aria-hidden="true" role="img" size={15} />
          )}
        </Button>
      </TooltipTrigger>
      {!loading && (
        <TooltipContent>
          <p>Execute current snippet</p>
        </TooltipContent>
      )}
    </Tooltip>
  )
}

export default RunButton
