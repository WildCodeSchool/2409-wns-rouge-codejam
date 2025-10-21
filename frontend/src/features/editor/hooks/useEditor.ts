import { useCallback, useEffect, useRef, useState } from 'react'

import { CUSTOM_THEMES } from '@/features/editor/config'
import { MonacoEditorInstance, MonacoTheme } from '@/features/editor/types'
import {
  defineTheme,
  initializeCursorPosition,
  resolveEditorTheme,
} from '@/features/editor/utils'
import { useModeContext } from '@/features/mode/hooks'

export default function useEditor() {
  const { mode, isDarkMode } = useModeContext()
  const editorRef = useRef<MonacoEditorInstance | null>(null)
  const [editorTheme, setEditorTheme] = useState<MonacoTheme | null>(null)
  const [loadingThemes, setLoadingThemes] = useState(true)

  // Initialize custom themes once and in parallel
  useEffect(() => {
    async function initCustomThemes() {
      await Promise.all(CUSTOM_THEMES.map(defineTheme))
      setLoadingThemes(false)
    }

    void initCustomThemes()
  }, [])

  // Update editor theme when mode changes or system preference changes
  useEffect(() => {
    if (mode !== 'system') {
      setEditorTheme(resolveEditorTheme(mode))
      return
    }
    setEditorTheme(
      isDarkMode ? resolveEditorTheme('dark') : resolveEditorTheme('light'),
    )
  }, [mode, isDarkMode])

  const handleOnEditorMount = useCallback(
    (editor: MonacoEditorInstance, code: string) => {
      editorRef.current = editor
      initializeCursorPosition(editor, code)
      // Set the initial editor theme only after custom themes are loaded
      if (!loadingThemes) {
        setEditorTheme(resolveEditorTheme(mode))
      }
    },
    [loadingThemes, mode],
  )

  return {
    editorRef,
    editorTheme,
    loadingThemes,
    isDarkMode,
    handleOnEditorMount,
  }
}
