import { useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  adjectives,
  animals,
  colors,
  Config,
  uniqueNamesGenerator,
} from 'unique-names-generator'

import { EditorStatus, EditorUrlParams } from '@/features/editor/types'

import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { SAVE_SNIPPET } from '@/shared/api/saveSnippet'
import { toastOptions } from '@/shared/config'
import { Language } from '@/shared/gql/graphql'

const SAVE_SNIPPET_SHORTCUT = 's'

const baseUniqueNameConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
}

export default function useEditorLeftActions(code: string, language: Language) {
  const { snippetId, snippetSlug } = useParams<EditorUrlParams>()
  const [status, setStatus] = useState<EditorStatus>('typing')
  const [saveSnippetMutation] = useMutation(SAVE_SNIPPET)
  const navigate = useNavigate()

  const saveSnippet = useCallback(async () => {
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
        refetchQueries: [{ query: GET_ALL_SNIPPETS }],
      })
      if (data?.saveSnippet) {
        const { id, slug } = data.saveSnippet

        // Updates the URL in the address bar without navigating or re-rendering anything
        navigate(`/editor/${id}/${slug}`, {
          replace: true,
        })
        setStatus('typing')
      }

      toast.success('Snippet saved successfully', {
        ...toastOptions.success,
      })
    } catch (err: unknown) {
      console.error(err)
      toast.error("Oops! We couldn't save your snippet...", {
        ...toastOptions.error,
      })
    } finally {
      setStatus('typing')
    }
  }, [code, language, navigate, saveSnippetMutation, snippetId, snippetSlug])

  const debouncedSaveSnippet = useMemo(
    () =>
      debounce(saveSnippet, 1000, {
        leading: true,
        trailing: false,
      }),
    [saveSnippet],
  )

  // Adds a keyboard shortcut to save the snippet.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SAVE_SNIPPET_SHORTCUT &&
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey
      ) {
        event.preventDefault()
        void debouncedSaveSnippet()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [debouncedSaveSnippet])

  return { debouncedSaveSnippet, SAVE_SNIPPET_SHORTCUT, status }
}
