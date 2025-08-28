import { Navigate, useParams } from 'react-router-dom'

import {
  EditorLayout,
  EditorPageSkeleton,
  ErrorState,
} from '@/features/editor/components/editor'
import { useEditorPage } from '@/features/editor/hooks'
import { EditorUrlParams } from '@/features/editor/types'

export default function EditorPage() {
  const { snippetId } = useParams<EditorUrlParams>()
  console.log('snippet use editor page', snippetId)
  const {
    loading,
    error,
    snippet,
    state,
    updateCode,
    updateLanguage,
    updateOutput,
    updateStatus,
  } = useEditorPage(snippetId)

  if (loading && !snippetId) {
    return <EditorPageSkeleton />
  }

  if (error) {
    return (
      <ErrorState message=" Oops the editor is momentarily unavailable... Please try again later." />
    )
  }

  // If snippetId is provided but no snippet found, redirect to home
  if (snippet === null) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="h-full">
      <EditorLayout
        state={state}
        onChangeCode={updateCode}
        onChangeLanguage={updateLanguage}
        onChangeOutput={updateOutput}
        onChangeStatus={updateStatus}
      />
    </div>
  )
}
