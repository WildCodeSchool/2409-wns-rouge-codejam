import { useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import { Share2Icon, PlayIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { GET_SNIPPET } from '@/shared/api/getSnippet'
import { Modal } from '@/shared/components'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Spinner } from '@/shared/components/ui/spinner'
import { toastOptions } from '@/shared/config'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'
import TooltipButton from '@/shared/TooltipButton'

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
  const navigate = useNavigate()
  const { snippetId, snippetSlug } = useParams<EditorUrlParams>()
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<Status>('typing')
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [execute] = useMutation(EXECUTE)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const copyUrl = useCallback(
    async (_e: React.MouseEvent<HTMLButtonElement>) => {
      console.log('clicked')
      setCopiedUrl(true)

      if (!snippetId) {
        toast.error('You need to execute the code first to share it.', {
          ...toastOptions.base,
          icon: toastOptions.error.Icon,
        })
        return
      }

      const url = window.location.href
      await navigator.clipboard.writeText(url)

      toast.success('URL copied to clipboard', {
        ...toastOptions.base,
        icon: toastOptions.success.Icon,
      })
    },
    [snippetId],
  )
  const handleCopyUrl = useMemo(
    () =>
      debounce(copyUrl, 1000, {
        leading: true,
        trailing: false,
      }),
    [copyUrl],
  )

  useEffect(() => {
    if (copiedUrl && code) {
      // Clear any existing timeout to avoid overlapping resets
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set a new timeout to reset `copiedUrl` after the toast duration
      timeoutRef.current = setTimeout(() => {
        setCopiedUrl(false)
        timeoutRef.current = null // clear the ref
      }, toastOptions.base.duration)
    }

    // Clear the timeout if component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [copiedUrl, code])

  // Cleanup on unmount the lodash debounce function to avoid memory leaks
  useEffect(() => {
    return () => {
      handleCopyUrl.cancel()
    }
  }, [handleCopyUrl])

  const executing = status === 'executing'
  const disabled = !code || executing || status === 'disabled'

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
        refetchQueries: [
          { query: GET_SNIPPET, variables: { id: snippetId } },
          // !TODO: refetch only when user is logged in and run code without any existing snippet...
          {
            query: GET_ALL_SNIPPETS,
          },
        ],
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
        // Update state with the result and status
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
            ...toastOptions.base,
            ...toastOptions.error,
          })
        }
      } else {
        console.error('Unexpected error:', error)
        toast.error('Execution service temporarily unavailable', {
          ...toastOptions.base,
          ...toastOptions.error,
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
      <TooltipButton
        tooltip="Execute current snippet"
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleExecute}
        className="min-w-24"
      >
        <span>Run</span>
        {executing ? (
          <Spinner size="small" />
        ) : (
          <PlayIcon aria-hidden="true" role="img" size={15} />
        )}
      </TooltipButton>

      <TooltipButton
        tooltip="Copy url to clipboard"
        variant="outline"
        aria-disabled={!code}
        disabled={!code || !snippetId}
        onClick={handleCopyUrl}
        className="min-w-24"
      >
        <span>Share</span>
        <Share2Icon aria-hidden="true" role="img" size={15} />
      </TooltipButton>

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
