import { useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { uniqueNamesGenerator } from 'unique-names-generator'

import { BASE_NAME_CONFIG } from '@/features/editor/config'
import { useEditorContext } from '@/features/editor/hooks'
import { EditorStatus, EditorUrlParams } from '@/features/editor/types'

import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { SAVE_SNIPPET } from '@/shared/api/saveSnippet'
import { TOAST_OPTIONS } from '@/shared/config'
import { useAppContext, useIsMobile } from '@/shared/hooks'

const SAVE_SNIPPET_SHORTCUT = 'KeyS'

export default function useEditorLeftActions() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { snippetId } = useParams<EditorUrlParams>()
  const {
    editorState: { code, language },
  } = useEditorContext()
  const { snippet } = useAppContext()
  const [status, setStatus] = useState<EditorStatus>('typing')
  const [saveSnippetMutation] = useMutation(SAVE_SNIPPET)

  const saveSnippet = useCallback(async () => {
    try {
      setStatus('saving')

      const { data } = await saveSnippetMutation({
        variables: {
          data: {
            code,
            language,
            name: snippet?.name ?? uniqueNamesGenerator(BASE_NAME_CONFIG),
          },
          id: snippetId ?? '',
        },
        refetchQueries: [GET_ALL_SNIPPETS],
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
        ...TOAST_OPTIONS.success,
      })
    } catch (err: unknown) {
      console.error(err)
      toast.error("Oops! We couldn't save your snippet...", {
        ...TOAST_OPTIONS.error,
      })
    } finally {
      setStatus('typing')
    }
  }, [code, language, navigate, saveSnippetMutation, snippet, snippetId])

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
        event.code === SAVE_SNIPPET_SHORTCUT &&
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

  return {
    code,
    debouncedSaveSnippet,
    isMobile,
    SAVE_SNIPPET_SHORTCUT,
    status,
  }
}
