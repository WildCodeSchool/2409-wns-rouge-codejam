import { useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adjectives,
  animals,
  colors,
  Config,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import { toast } from 'sonner'

import { EditorUrlParams, EditorStatus } from '@/features/editor/types'
import { EXECUTE } from '@/shared/api/execute'
import { GET_SNIPPET } from '@/shared/api/getSnippet'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { toastOptions } from '@/shared/config'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'

const baseUniqueNameConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
}

export default function useEditorRightActions(
  code: string,
  language: Language,
  onChangeOutput: (nextOutput: string) => void,
  onChangeStatus: (nextStatus?: ExecutionStatus) => void,
) {
  const { snippetId, snippetSlug } = useParams<EditorUrlParams>()
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<EditorStatus>('typing')
  const [execute] = useMutation(EXECUTE)
  const navigate = useNavigate()

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const shareUrl = useCallback(
    async (_e: React.MouseEvent<HTMLButtonElement>) => {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      toast.success('URL copied to clipboard', {
        ...toastOptions.base,
        icon: toastOptions.success.Icon,
      })
    },
    [],
  )
  const debouncedShareUrl = useMemo(
    () =>
      debounce(shareUrl, 1000, {
        leading: true,
        trailing: false,
      }),
    [shareUrl],
  )

  async function executeSnippet() {
    try {
      setStatus('executing')
      const { data } = await execute({
        variables: {
          data: {
            name: snippetSlug ?? uniqueNamesGenerator(baseUniqueNameConfig),
            code,
            language: language,
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
          toast.error("Oops! We couldn't run your code...", {
            ...toastOptions.error,
          })
        }
      } else {
        console.error('Unexpected error:', error)
        toast.error('Oops! Our service is temporarily unavailable...', {
          ...toastOptions.error,
        })
      }
    } finally {
      setStatus('typing')
    }
  }

  return {
    executeSnippet,
    debouncedShareUrl,
    status,
    showModal,
    closeModal,
    snippetId,
  }
}
