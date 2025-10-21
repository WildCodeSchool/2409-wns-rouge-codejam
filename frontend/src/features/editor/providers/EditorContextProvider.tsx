import { useCallback, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { STARTER_SNIPPETS } from '@/features/editor/config'
import { EditorContext } from '@/features/editor/contexts'
import {
  editorReducer,
  EditorState,
  initialEditorState,
} from '@/features/editor/reducers'
import { EditorUrlParams } from '@/features/editor/types'

import {
  ExecutionStatus,
  GetSnippetQuery,
  Language,
} from '@/shared/gql/graphql'
import { useAppContext } from '@/shared/hooks'

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

export default function EditorContextProvider({
  children,
}: React.PropsWithChildren) {
  const { snippetId } = useParams<EditorUrlParams>()
  const { snippet } = useAppContext()

  const [editorState, dispatch] = useReducer(
    editorReducer,
    initialEditorState,
    () => initializeEditorState(snippet),
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
          language: snippet.language,
          code: snippet.code,
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
      toast.error("Oops! We couldn't find your snippet...", {
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
        snippetId ?? editorState.code !== STARTER_SNIPPETS[editorState.language]

      // If current code is starter code, switch to next language starter code
      const nextCode = keepCode
        ? editorState.code
        : STARTER_SNIPPETS[nextLanguage.toUpperCase() as Language]

      dispatch({
        type: 'SET_LANGUAGE',
        language: nextLanguage.toUpperCase() as Language,
        code: nextCode,
      })
    },
    [snippetId, editorState.code, editorState.language],
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

  const ctx = {
    snippet,
    editorState,
    updateCode,
    updateLanguage,
    updateOutput,
    updateStatus,
  }

  return <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>
}
