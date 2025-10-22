import { useContext } from 'react'

import { EditorContext } from '@/features/editor/contexts/EditorContext'

export default function useEditorContext() {
  const ctx = useContext(EditorContext)
  if (!ctx) {
    throw new Error(
      'useEditorContext must be used within a EditorContextProvider!',
    )
  }
  return ctx
}
