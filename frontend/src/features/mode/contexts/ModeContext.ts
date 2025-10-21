import { createContext } from 'react'

import { Mode } from '@/features/mode/types'

type ModeContextValue = {
  mode: Mode
  isDarkMode: boolean
  changeMode: (theme: ModeContextValue['mode']) => void
}

export const ModeContext = createContext<ModeContextValue | null>(null)
