import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Language } from '@/shared/gql/graphql'

import javascriptIcon from '/assets/icons/javascript.svg'
import typescriptIcon from '/assets/icons/typescript.svg'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLanguageIcon(language: Language) {
  const languageIcons: Record<Language, string> = {
    [Language.Javascript]: javascriptIcon,
    [Language.Typescript]: typescriptIcon,
  }
  if (!(language in languageIcons)) {
    throw new Error(
      `Icon for language ${language} not found! Did you forget to add it?`,
    )
  }
  return languageIcons[language]
}

export function getObjectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[]
}

export function wait(delayInMs = 1500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, delayInMs)
  })
}
