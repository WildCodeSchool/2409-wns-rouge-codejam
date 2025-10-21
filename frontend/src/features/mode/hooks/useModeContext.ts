import { useContext } from 'react'

import { ModeContext } from '@/features/mode/contexts'

export default function useModeContext() {
  const ctx = useContext(ModeContext)
  if (!ctx) {
    throw new Error('useModeContext must be used within a ModeContextProvider!')
  }
  return ctx
}
