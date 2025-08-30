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
import { SAVE_SNIPPET } from '@/shared/api/saveSnippet'

const baseUniqueNameConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
}

export default function useEditorLeftActions(code: string, language: Language) {
  const { snippetId, snippetSlug } = useParams<EditorUrlParams>()
  const [status, setStatus] = useState<Status>('typing')
  const [saveSnippetMutation] = useMutation(SAVE_SNIPPET)
  const navigate = useNavigate()

  async function saveSnippet() {
    try {
      setStatus('saving')

      const { data } = await saveSnippetMutation({
        variables: {
          data: {
            code,
            language,
            name: snippetSlug ?? uniqueNamesGenerator(baseUniqueNameConfig),
          },
          id: snippetId ?? '',
        },
      })
      if (data?.saveSnippet) {
        const { id, slug } = data.saveSnippet

        // Updates the URL in the address bar without navigating or re-rendering anything
        navigate(`/editor/${id}/${slug}`, {
          replace: true,
        })
        setStatus('typing')
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
