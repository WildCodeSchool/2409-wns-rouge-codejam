import { Save } from 'lucide-react'

import { LanguageSelect } from '@/features/editor/components'
import { useEditorLeftActions } from '@/features/editor/hooks'
import { TooltipButton } from '@/shared/components'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Spinner } from '@/shared/components/ui/spinner'
import { Language } from '@/shared/gql/graphql'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'

type EditorLeftActionProps = {
  code: string
  language: Language
  onChangeLanguage: (language: string) => void
}

export default function EditorLeftActions({
  code,
  language,
  onChangeLanguage,
}: EditorLeftActionProps) {
  const isMobile = useIsMobile()
  const { debouncedSaveSnippet, SAVE_SNIPPET_SHORTCUT, status } =
    useEditorLeftActions(code, language)

  const isSaving = status === 'saving'

  return (
    <div className="flex justify-start gap-4">
      <LanguageSelect language={language} onChange={onChangeLanguage} />

      <TooltipButton
        tooltip={`Save current snippet (⌘⇧${SAVE_SNIPPET_SHORTCUT.toUpperCase()})`}
        variant="outline"
        aria-disabled={!code}
        disabled={!code || isSaving}
        onClick={debouncedSaveSnippet}
        className={cn(
          'min-w-24',
          isMobile && 'aspect-square min-w-[unset] rounded-full px-2!',
        )}
      >
        {!isMobile && <span>Save</span>}
        {isSaving ? (
          <Spinner show size="small" />
        ) : (
          <Save aria-hidden="true" size={15} />
        )}
      </TooltipButton>
    </div>
  )
}

export function EditorLeftActionsSkeleton() {
  const isMobile = useIsMobile()

  return (
    <div className="flex justify-start gap-4">
      <Skeleton className="h-9 w-40" />
      <Skeleton className={cn('h-9', isMobile ? 'w-9 rounded-full' : 'w-24')} />
    </div>
  )
}
