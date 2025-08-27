import { useState } from 'react'
import { EditorUrlParams, Status } from '../types'
import { toast } from 'sonner'
import { Language } from '@/shared/gql/graphql'
import { useMutation } from '@apollo/client'
import {
  adjectives,
  animals,
  colors,
  Config,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import { useNavigate, useParams } from 'react-router-dom'
import { UPDATE_SNIPPET } from '@/shared/api/updateSnippet'
import { CREATE_SNIPPET } from '@/shared/api/createSnippet'

const baseUniqueNameConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
}

export default function useEditorLeftActions() {
  const { snippetId, snippetSlug } = useParams<EditorUrlParams>()
  const [status, setStatus] = useState<Status>('typing')
  const [updateSnippet] = useMutation(UPDATE_SNIPPET)
  const [createSnippet] = useMutation(CREATE_SNIPPET)
  const navigate = useNavigate()

  async function saveSnippet(code: string, language: Language) {
    try {
      setStatus('saving')

      // If a snippet exists, we update it, otherwise we create a new one
      if (snippetId) {
        await updateSnippet({
          variables: {
            data: {
              code,
              language,
            },
            updateSnippetId: snippetId,
          },
        })
      } else {
        const { data } = await createSnippet({
          variables: {
            data: {
              code,
              language,
              name: snippetSlug ?? uniqueNamesGenerator(baseUniqueNameConfig),
            },
          },
        })
        if (data) {
          const { id, slug } = data.createSnippet

          // Updates the URL in the address bar without navigating or re-rendering anything
          navigate(`/editor/${id}/${slug}`, {
            replace: true,
          })
          setStatus('typing')
        }
      }

      toast.success('Successfully saved')
    } catch (err) {
      toast.error('Failed to save', {
        description: err instanceof Error ? err.message : JSON.stringify(err),
      })
    } finally {
      setStatus('typing')
    }
  }

  return { saveSnippet, status }
}
