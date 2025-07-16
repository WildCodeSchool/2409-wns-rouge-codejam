import { useContext } from 'react'

import { EditorContext } from '@/features/editor/contexts'

export default function useEditorContext() {
  const ctx = useContext(EditorContext)
  if (ctx === null) {
    throw new Error(
      'useEditorContext must be used within an EditorContextProvider!',
    )
  }
  return ctx
}
