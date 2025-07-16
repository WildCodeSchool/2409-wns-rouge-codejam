import { useState } from 'react'

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
  const [language, setLanguage] = useState<Language>(Language.Javascript)

  const handleOnChange = (value: string) => {
    setLanguage(value as Language)
  }

  return (
    <div className="text-accent absolute top-4 right-6 z-10 flex flex-col gap-4">
      <Select value={language} onValueChange={handleOnChange}>
        <SelectTrigger className="w-fit cursor-pointer border-0 p-0">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {languages.map((language) => (
              <SelectItem
                key={language.id}
                value={language.value}
                className="cursor-pointer"
              >
                <img
                  src={language.icon}
                  alt={language.value.toLowerCase()}
                  width={36}
                  height={36}
                />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
