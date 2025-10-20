import { useContext } from 'react'

import { ModeContext } from '@/features/mode/contexts'

export default function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) {
    throw new Error('useMode must be used within a ModeContextProvider!')
  }
  return ctx
}
