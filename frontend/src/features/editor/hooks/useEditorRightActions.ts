import { useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { uniqueNamesGenerator } from 'unique-names-generator'

import { BASE_NAME_CONFIG } from '@/features/editor/config'
import { useEditorContext } from '@/features/editor/hooks'
import { EditorStatus, EditorUrlParams } from '@/features/editor/types'

import { EXECUTE } from '@/shared/api/execute'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { TOAST_OPTIONS } from '@/shared/config'
import { ExecutionStatus } from '@/shared/gql/graphql'
import { useAppContext, useIsMobile } from '@/shared/hooks'

const SHARE_SNIPPET_SHORTCUT = 'KeyC'
const RUN_SNIPPET_SHORTCUT = 'KeyE'

export default function useEditorRightActions() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { snippetId, snippetSlug } = useParams<EditorUrlParams>()
  const { snippet } = useAppContext()
  const {
    editorState: { code, language },
    updateOutput,
    updateStatus,
  } = useEditorContext()
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<EditorStatus>('typing')
  const [execute] = useMutation(EXECUTE)

  const runSnippet = useCallback(async () => {
    try {
      setStatus('executing')
      const { data } = await execute({
        variables: {
          data: {
            name:
              snippetSlug && snippet
                ? snippet.name
                : uniqueNamesGenerator(BASE_NAME_CONFIG),
            code,
            language,
          },
          snippetId,
        },
        refetchQueries: [GET_ALL_SNIPPETS],
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
        updateOutput(result)
        updateStatus(status)
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
            ...TOAST_OPTIONS.error,
            description: error.message,
          })
        }
      } else {
        console.error('Unexpected error:', error)
        toast.error('Oops! Our service is temporarily unavailable...', {
          ...TOAST_OPTIONS.error,
        })
      }
    } finally {
      setStatus('typing')
    }
  }, [
    code,
    execute,
    language,
    navigate,
    snippetSlug,
    snippet,
    snippetId,
    updateOutput,
    updateStatus,
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
        ...TOAST_OPTIONS.base,
        icon: TOAST_OPTIONS.success.Icon,
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
    code,
    debouncedRunSnippet,
    debouncedShareUrl,
    isMobile,
    RUN_SNIPPET_SHORTCUT,
    SHARE_SNIPPET_SHORTCUT,
    showModal,
    snippetId,
    status,
  }
}
