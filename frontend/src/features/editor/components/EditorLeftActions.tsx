import { Save } from 'lucide-react'

import { LanguageSelect } from '@/features/editor/components'
import { useEditorLeftActions } from '@/features/editor/hooks'
import { TooltipButton } from '@/shared/components'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Spinner } from '@/shared/components/ui/spinner'
import { Language } from '@/shared/gql/graphql'

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
  const { saveSnippet, status } = useEditorLeftActions(code, language)

  return (
    <div className="flex justify-start gap-4">
      <LanguageSelect language={language} onChange={onChangeLanguage} />

      <TooltipButton
        tooltip="Save current snippet"
        variant="outline"
        aria-disabled={!code}
        disabled={!code}
        onClick={saveSnippet}
        className="min-w-24"
      >
        <span>Save</span>
        {status === 'saving' ? (
          <Spinner show size="small" />
        ) : (
          <Save aria-hidden="true" size={15} />
        )}
      </TooltipButton>
    </div>
  )
}

export function EditorLeftActionsSkeleton() {
  return (
    <div className="flex justify-start gap-4">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-9 w-24" />
    </div>
  )
}
