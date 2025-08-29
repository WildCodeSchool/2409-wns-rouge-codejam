import { useCallback, useEffect, useReducer } from 'react'
import { toast } from 'sonner'

import { STARTER_SNIPPET } from '@/features/editor/components/editor'
import { useSnippet } from '@/features/editor/hooks'
import {
  editorReducer,
  EditorState,
  initialEditorState,
} from '@/features/editor/reducers'

import {
  ExecutionStatus,
  GetSnippetQuery,
  Language,
} from '@/shared/gql/graphql'

const initializeEditorState = (
  snippet: GetSnippetQuery['getSnippet'] | null | undefined,
): EditorState => {
  if (!snippet) {
    return initialEditorState
  }
  return {
    language: snippet.language,
    code: snippet.code,
    output: snippet.executions?.[0].result ?? '',
    executionStatus: snippet.executions?.[0].status ?? undefined,
  }
}

export default function useEditorPage(snippetId?: string) {
  const { snippet, loading, error } = useSnippet(snippetId)
  const [state, dispatch] = useReducer(editorReducer, initialEditorState, () =>
    initializeEditorState(snippet),
  )

  // Initialize from snippet or starter code
  useEffect(() => {
    if (!snippetId) {
      dispatch({ type: 'RESET' })
    }

    if (snippet) {
      const lastExecution = snippet.executions?.[0]
      dispatch({
        type: 'SET_INITIAL_VALUES',
        payload: {
          language: snippet?.language,
          code: snippet?.code,
          output: lastExecution?.result,
          executionStatus: lastExecution?.status,
        },
      })
    }
  }, [snippetId, snippet])

  /**
   *  Show toast once if snippet not found.
   *  Prefer toast in effect (side-effect), not in render (could fire multiple times).
   */
  useEffect(() => {
    if (snippet === null) {
      toast.error('Snippet not found', {
        description: 'Redirecting to home...',
      })
    }
  }, [snippet])

  const updateCode = useCallback((nextCode?: string) => {
    dispatch({ type: 'SET_CODE', code: nextCode ?? '' })
  }, [])
  const updateLanguage = useCallback(
    (nextLanguage: string) => {
      const keepCode =
        snippetId ?? state.code !== STARTER_SNIPPET[state.language]

      // If current code is starter code, switch to next language starter code
      const nextCode = keepCode
        ? state.code
        : STARTER_SNIPPET[nextLanguage.toUpperCase() as Language]

      dispatch({
        type: 'SET_LANGUAGE',
        language: nextLanguage.toUpperCase() as Language,
        code: nextCode,
      })
    },
    [state.code, state.language],
  )
  const updateOutput = useCallback((nextOutput?: string) => {
    dispatch({ type: 'SET_OUTPUT', output: nextOutput ?? '' })
  }, [])
  const updateStatus = useCallback((nextStatus?: ExecutionStatus) => {
    dispatch({
      type: 'SET_EXECUTION_STATUS',
      executionStatus: nextStatus,
    })
  }, [])

  return {
    snippet,
    loading,
    error,
    state,
    updateCode,
    updateLanguage,
    updateOutput,
    updateStatus,
  }
}
