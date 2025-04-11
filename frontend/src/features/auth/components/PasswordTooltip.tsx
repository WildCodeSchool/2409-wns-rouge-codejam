import { Info } from 'lucide-react'
import { PASSWORD_REQUIREMENT } from '@/features/auth/schemas/formSchema'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'

const PasswordTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          aria-label="Show password requirements"
          className="h-fit w-fit cursor-pointer"
        >
          <Info aria-hidden="true" role="img" size={15} />
        </TooltipTrigger>
        <TooltipContent align="start">
          <ul className="list-inside list-disc">
            Password requirements:
            {Object.values(PASSWORD_REQUIREMENT).map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default PasswordTooltip
