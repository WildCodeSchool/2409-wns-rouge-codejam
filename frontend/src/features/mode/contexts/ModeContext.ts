import { createContext } from 'react'

export type Mode = 'dark' | 'light' | 'system'

type ModeContextValue = {
  mode: Mode
  changeMode: (theme: ModeContextValue['mode']) => void
}

export const ModeContext = createContext<ModeContextValue | null>(null)
