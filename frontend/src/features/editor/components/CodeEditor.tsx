import MonacoEditor from '@monaco-editor/react'

import { BASE_OPTIONS } from '@/features/editor/config'
import { useEditor } from '@/features/editor/hooks'
import { MonacoEditorInstance } from '@/features/editor/types'

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
  const { editorTheme, handleOnEditorMount, isDarkMode, loadingThemes } =
    useEditor()
  const isMobile = useIsMobile()

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
  return <div className="bg-background h-full w-full rounded-md" />
}

export function CodeEditorSkeleton() {
  return (
    <div className="relative h-full overflow-hidden rounded-md pt-4">
      <Skeleton className={cn(baseEditorClasses)} />
    </div>
  )
}
