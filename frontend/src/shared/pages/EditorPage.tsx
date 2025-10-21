import { Navigate, useParams } from 'react-router-dom'

import {
  EditorLayout,
  EditorPageSkeleton,
  ErrorState,
} from '@/features/editor/components'
import { EditorContextProvider } from '@/features/editor/providers'
import { EditorUrlParams } from '@/features/editor/types'

import { useAppContext } from '@/shared/hooks'

export default function EditorPage() {
  const { snippetId } = useParams<EditorUrlParams>()
  const { snippet, loadingSnippet, errorSnippet } = useAppContext()

  if (loadingSnippet && !snippetId) {
    return <EditorPageSkeleton />
  }

  if (errorSnippet) {
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
      <EditorContextProvider>
        <EditorLayout />
      </EditorContextProvider>
    </div>
  )
}
