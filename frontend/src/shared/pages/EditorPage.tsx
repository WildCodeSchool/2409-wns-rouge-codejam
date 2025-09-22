import { Navigate, useParams } from 'react-router-dom'

import {
  EditorLayout,
  EditorPageSkeleton,
  ErrorState,
} from '@/features/editor/components/editor'
import { useEditorPage } from '@/features/editor/hooks'
import { EditorUrlParams } from '@/features/editor/types'
import { SidebarProvider } from '../components/ui/sidebar'

export default function EditorPage() {
  const { snippetId } = useParams<EditorUrlParams>()
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
    <SidebarProvider>
      <div className="h-full w-full">
        <EditorLayout
          state={state}
          onChangeCode={updateCode}
          onChangeLanguage={updateLanguage}
          onChangeOutput={updateOutput}
          onChangeStatus={updateStatus}
        />
      </div>
    </SidebarProvider>
  )
}
