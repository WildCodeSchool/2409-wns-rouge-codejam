import MonacoEditor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'

import { BASE_OPTIONS, CUSTOM_THEMES } from '@/features/editor/config'
import { MonacoEditorInstance, MonacoTheme } from '@/features/editor/types'
import {
  defineTheme,
  initializeCursorPosition,
  resolveEditorTheme,
} from '@/features/editor/utils'
import { useMode } from '@/features/mode/hooks'

import { Skeleton } from '@/shared/components/ui/skeleton'
import { Language } from '@/shared/gql/graphql'
import { cn } from '@/shared/lib/utils'

type CodeEditorProps = {
  code: string
  language: Language
  onChange: (nextCode?: string) => void
}

const baseEditorClasses =
  'absolute h-full w-full rounded-md border border-transparent [&_.monaco-editor]:rounded-md [&_.overflow-guard]:rounded-md'

const prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

export default function CodeEditor({
  code,
  language,
  onChange,
}: CodeEditorProps) {
  const editorRef = useRef<MonacoEditorInstance | null>(null)
  const [editorTheme, setEditorTheme] = useState<MonacoTheme | null>(null)
  const [loadingThemes, setLoadingThemes] = useState(true)
  const { mode } = useMode()

  const isDarkMode =
    mode === 'system' ? prefersDarkMediaQuery.matches : mode === 'dark'

  /*
    Initialize custom themes once and in parallel.
    Also, if mode is `system`, listen for system mode changes.
  */
  useEffect(() => {
    async function initCustomThemes() {
      await Promise.all(CUSTOM_THEMES.map(defineTheme))
      setLoadingThemes(false)
    }

    void initCustomThemes()

    if (mode !== 'system') {
      return
    }

    const listener = (e: MediaQueryListEvent) => {
      const nextTheme = resolveEditorTheme(e.matches ? 'dark' : 'light')
      setEditorTheme(nextTheme)
    }
    prefersDarkMediaQuery.addEventListener('change', listener)

    return () => {
      prefersDarkMediaQuery.removeEventListener('change', listener)
    }
  }, [])

  // Update editor theme when mode changes
  useEffect(() => {
    const nextTheme = resolveEditorTheme(mode)
    setEditorTheme(nextTheme)
  }, [mode])

  const handleOnEditorMount = (editor: MonacoEditorInstance) => {
    editorRef.current = editor
    initializeCursorPosition(editor, code)
    // Set the initial editor theme only after custom themes are loaded
    if (!loadingThemes) {
      setEditorTheme(resolveEditorTheme(mode))
    }
  }

  if (loadingThemes || !editorTheme) {
    return <EditorLoadingSkeleton />
  }

  return (
    <div className="relative">
      <MonacoEditor
        defaultLanguage="javascript"
        language={language.toLowerCase()}
        value={code}
        onChange={onChange}
        onMount={handleOnEditorMount}
        loading={<EditorLoadingSkeleton />} // 👈 prevent displaying default loader and layout flickering
        theme={editorTheme}
        options={BASE_OPTIONS}
        className={cn(baseEditorClasses, !isDarkMode && 'border-input')}
      />
    </div>
  )
}

function EditorLoadingSkeleton() {
  return <div className="bg-background h-full w-full rounded-md" />
}

export function CodeEditorSkeleton() {
  return <Skeleton className="h-full" />
}
