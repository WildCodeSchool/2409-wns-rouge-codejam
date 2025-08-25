import { useMutation } from '@apollo/client'
import { PlayIcon, Share2Icon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  adjectives,
  animals,
  colors,
  Config,
  uniqueNamesGenerator,
} from 'unique-names-generator'

import { Subscribe } from '@/features/editor/components/editor'
import { EditorUrlParams, Status } from '@/features/editor/types'

import { EXECUTE } from '@/shared/api/execute'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { Modal } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
import { Spinner } from '@/shared/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'
import { Skeleton } from '@/shared/components/ui/skeleton'

type EditorActionProps = {
  code: string
  language: Language
  onChangeOutput: (nextOutput: string) => void
  onChangeStatus: (nextStatus?: ExecutionStatus) => void
}

const baseUniqueNameConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
}

export default function EditorActions({
  code,
  language,
  onChangeOutput,
  onChangeStatus,
}: EditorActionProps) {
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<Status>('typing')
  const [execute] = useMutation(EXECUTE)
  const navigate = useNavigate()
  const { snippetId, snippetSlug } = useParams<EditorUrlParams>()

  const isExecuting = status === 'executing'
  const disabled = !code || isExecuting || status === 'disabled'

  const handleExecute = async (_e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setStatus('executing')
      const { data } = await execute({
        variables: {
          data: {
            name: snippetSlug ?? uniqueNamesGenerator(baseUniqueNameConfig),
            code,
            language: language.toLowerCase(),
          },
          snippetId: snippetId,
        },
        refetchQueries: [{ query: WHO_AM_I }],
      })
      if (data) {
        const {
          result,
          status,
          snippet: { id, slug },
        } = data.execute

        if (status === ExecutionStatus.Success) {
          // Updates the URL in the address bar without navigating or re-rendering anything
          navigate(`/editor/${id}/${slug}`, {
            replace: true,
          })

          setStatus('typing')
        }
        // Update context with the result and status
        onChangeOutput(result)
        onChangeStatus(status)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const executionCountExceeded = error.message.includes(
          'Execution limit exceeded',
        )
        if (executionCountExceeded) {
          setShowModal(true)
          setStatus('disabled')
        } else {
          console.error('Error executing code:', error.message)
          toast.error(`Error executing code: ${error.message}`, {
            description: 'Please try again later.',
          })
        }
      } else {
        console.error('Unexpected error:', error)
        toast.error('Execution service temporarily unavailable', {
          description: 'Please try again later.',
        })
      }
    } finally {
      setStatus('typing')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className="flex justify-end gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            aria-label={'Execute current snippet'}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={handleExecute}
            className="min-w-24"
          >
            <span>Run</span>
            {isExecuting ? (
              <Spinner size="small" />
            ) : (
              <PlayIcon aria-hidden="true" role="img" size={15} />
            )}
          </Button>
        </TooltipTrigger>
        {!isExecuting && (
          <TooltipContent>
            <p>Execute current snippet</p>
          </TooltipContent>
        )}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            aria-label={'Copy url to clipboard'}
            variant="outline"
            aria-disabled={!code}
            disabled={!code}
            onClick={() => {
              alert('🚧 Copy current url to clipboard...')
            }}
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

      {showModal && (
        <Modal
          open
          title="You've reached your daily execution limit!"
          onOpenChange={handleCloseModal}
        >
          <Subscribe onRedirect={handleCloseModal} />
        </Modal>
      )}
    </div>
  )
}

export function EditorActionsSkeleton() {
  return (
    <div className="ml-auto flex justify-end gap-4">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
    </div>
  )
}
