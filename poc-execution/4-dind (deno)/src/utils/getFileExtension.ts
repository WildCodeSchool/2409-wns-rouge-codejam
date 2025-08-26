import { Language } from '../types'

export function getFileExtension(language: string): string {
  let languageExtension = ''

  switch (language) {
    case Language.JS: {
      languageExtension = 'js'
      break
    }
    case Language.TS: {
      languageExtension = 'ts'
      break
    }
    default: {
      throw new Error('Language not supported')
    }
  }

  return languageExtension
}
