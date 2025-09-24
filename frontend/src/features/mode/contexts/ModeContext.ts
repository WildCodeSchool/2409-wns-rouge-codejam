import { createContext } from 'react'

export const modeOptions = ['dark', 'light', 'system'] as const

export type Mode = (typeof modeOptions)[number]

type ModeContextValue = {
  mode: Mode
  changeMode: (theme: ModeContextValue['mode']) => void
}

export const ModeContext = createContext<ModeContextValue | null>(null)
