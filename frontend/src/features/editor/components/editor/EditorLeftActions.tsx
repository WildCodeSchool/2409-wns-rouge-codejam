import { LanguageSelect } from '@/features/editor/components/editor'
import { Language } from '@/shared/gql/graphql'
import { Skeleton } from '@/shared/components/ui/skeleton'
import SaveButton from './SaveButton'
import useEditorLeftActions from '../../hooks/useEditorLeftActions'

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
  const { saveSnippet } = useEditorLeftActions()

  const handleSave = async () => {
    await saveSnippet(code, language)
  }

  return (
    <div className="flex justify-start gap-4">
      <LanguageSelect language={language} onChange={onChangeLanguage} />
      <SaveButton disabled={!code} loading={false} onClick={handleSave} />
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
