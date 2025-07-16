import { useEditorContext } from '@/features/editor/hooks'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Language } from '@/shared/gql/graphql'
import { getLanguageIcon, getObjectKeys } from '@/shared/lib/utils'

const keys = getObjectKeys(Language)

const languages = keys.map((key) => ({
  id: crypto.randomUUID(),
  label: key,
  value: Language[key],
  icon: getLanguageIcon(Language[key]),
}))

export default function LanguageSelect() {
  const { language, handleSelectLanguage } = useEditorContext()

  return (
    <div className="text-primary">
      <Select value={language} onValueChange={handleSelectLanguage}>
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {languages.map((language) => (
              <SelectItem key={language.id} value={language.value}>
                <div className="flex cursor-pointer items-center gap-4">
                  <span>{language.label}</span>
                  <img
                    src={language.icon}
                    alt={language.value.toLowerCase()}
                    width={18}
                    height={18}
                  />
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
