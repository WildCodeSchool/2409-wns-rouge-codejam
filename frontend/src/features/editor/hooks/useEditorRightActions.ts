import { useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

const SHARE_SNIPPET_SHORTCUT = 'KeyC'
const RUN_SNIPPET_SHORTCUT = 'KeyE'

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

  const runSnippet = useCallback(async () => {
    try {
      setStatus('executing')
      const { data } = await execute({
        variables: {
          data: {
            name: snippetSlug ?? uniqueNamesGenerator(baseUniqueNameConfig),
            code,
            language,
          },
          snippetId,
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
  }, [
    snippetSlug,
    code,
    language,
    snippetId,
    navigate,
    execute,
    onChangeOutput,
    onChangeStatus,
  ])

  const debouncedRunSnippet = useMemo(
    () =>
      debounce(runSnippet, 1000, {
        leading: true,
        trailing: false,
      }),
    [runSnippet],
  )

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const shareUrl = useCallback(
    async (_e?: React.MouseEvent<HTMLButtonElement>) => {
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

  // Adds a keyboard shortcut to run the snippet.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === RUN_SNIPPET_SHORTCUT &&
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey
      ) {
        event.preventDefault()
        void debouncedRunSnippet()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [debouncedRunSnippet])

  // Adds a keyboard shortcut to share the snippet.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === SHARE_SNIPPET_SHORTCUT &&
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey
      ) {
        event.preventDefault()
        void debouncedShareUrl()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [debouncedShareUrl])

  return {
    closeModal,
    debouncedRunSnippet,
    debouncedShareUrl,
    RUN_SNIPPET_SHORTCUT,
    SHARE_SNIPPET_SHORTCUT,
    showModal,
    snippetId,
    status,
  }
}
