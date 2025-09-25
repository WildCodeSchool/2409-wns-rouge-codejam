import { useCallback, useState } from 'react'
import { EditorUrlParams, Status } from '../types'
import { toast } from 'sonner'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'
import { useMutation } from '@apollo/client'
import { EXECUTE } from '@/shared/api/execute'
import {
  adjectives,
  animals,
  colors,
  Config,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import { useNavigate, useParams } from 'react-router-dom'
import { GET_SNIPPET } from '@/shared/api/getSnippet'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'

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
  const [status, setStatus] = useState<Status>('typing')
  const [execute] = useMutation(EXECUTE)
  const navigate = useNavigate()

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  function shareSnippet() {
    alert('🚧 Copy current url to clipboard...')
  }

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
          GET_ALL_SNIPPETS,
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
          toast.error('Error executing code:', {
            description: error.message,
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

  return { executeSnippet, shareSnippet, status, showModal, closeModal }
}
