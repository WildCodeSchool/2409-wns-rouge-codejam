import { CircleHelpIcon } from 'lucide-react'

import { PASSWORD_REQUIREMENT } from '@/features/auth/schemas'

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
          <CircleHelpIcon aria-hidden="true" size={15} className="text-link" />
        </TooltipTrigger>
        <TooltipContent align="start">
          <ul className="list-inside list-disc">
            Password requirements:
            {Object.values(PASSWORD_REQUIREMENT).map((requirement, index) => (
              <li key={index} className="first:mt-2">
                {requirement}
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default PasswordTooltip
