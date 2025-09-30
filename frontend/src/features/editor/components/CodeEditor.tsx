import MonacoEditor from '@monaco-editor/react'

import { BASE_OPTIONS } from '@/features/editor/config'
import { useEditor } from '@/features/editor/hooks'
import { MonacoEditorInstance } from '@/features/editor/types'
import { resolveOutputBackgroundColor } from '@/features/editor/utils'

import { Skeleton } from '@/shared/components/ui/skeleton'
import { Language } from '@/shared/gql/graphql'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'

const baseEditorClasses =
  'absolute h-full w-full rounded-md border border-transparent [&_.monaco-editor]:rounded-md [&_.overflow-guard]:rounded-md'

type CodeEditorProps = {
  code: string
  language: Language
  onChange: (nextCode?: string) => void
}

export default function CodeEditor({
  code,
  language,
  onChange,
}: CodeEditorProps) {
  const isMobile = useIsMobile()
  const { editorTheme, handleOnEditorMount, isDarkMode, loadingThemes } =
    useEditor()

  if (loadingThemes || !editorTheme) {
    return <EditorLoadingSkeleton />
  }

  return (
    <div className={cn('relative h-full', isMobile ? 'pt-2' : 'pt-4')}>
      <MonacoEditor
        defaultLanguage="javascript"
        options={BASE_OPTIONS}
        language={language.toLowerCase()}
        loading={<EditorLoadingSkeleton />} // 👈 prevent displaying default loader and layout flickering
        value={code}
        theme={editorTheme}
        className={cn(baseEditorClasses, !isDarkMode && 'border-input')}
        onChange={onChange}
        onMount={(editor: MonacoEditorInstance) => {
          handleOnEditorMount(editor, code)
        }}
      />
    </div>
  )
}

function EditorLoadingSkeleton() {
  const isMobile = useIsMobile()
  const { isDarkMode } = useEditor()

  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden rounded-md',
        isMobile ? 'pt-2' : 'pt-4',
      )}
    >
      <div
        className={cn(
          'h-full w-full rounded-md border border-transparent',
          resolveOutputBackgroundColor(isDarkMode),
          !isDarkMode && 'border-input',
        )}
      />
    </div>
  )
}

export function CodeEditorSkeleton() {
  return (
    <div className="relative h-full overflow-hidden rounded-md pt-4">
      <Skeleton className={cn(baseEditorClasses)} />
    </div>
  )
}
