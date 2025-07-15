import { Language } from '../types'

export function getFileExtension(language: string): string {
  let languageExtension = ''

  switch (language) {
    case Language.JAVASCRIPT: {
      languageExtension = 'js'
      break
    }
    case Language.TYPESCRIPT: {
      languageExtension = 'ts'
      break
    }
    default: {
      throw new Error('Language not supported')
    }
  }

  return languageExtension
}
