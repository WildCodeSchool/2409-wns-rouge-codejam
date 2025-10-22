import { useCallback, useEffect, useState } from 'react'

import { ModeContext } from '@/features/mode/contexts'
import { Mode } from '@/features/mode/types'
import { applyMode, prefersDarkMediaQuery } from '@/features/mode/utils'

type ModeContextProviderProps = React.PropsWithChildren & {
  /** The default mode to use if nothing is found in localStorage. Defaults to `"system"`. */
  defaultMode?: Mode
  /** The localStorage key under which the mode preference will be persisted. Defaults to `"mode"`. */
  storageKey?: string
}

/**
 * Mode context provider for managing light/dark/system modes in the application.
 *
 * Responsibilities:
 * - Loads the initial mode preference from `localStorage` (or falls back to `defaultMode`).
 * - Persists mode changes to `localStorage`.
 * - Applies the chosen mode to the document root `<html>` element by adding `light` or `dark` classes.
 * - Listens for system mode changes when the mode is set to `"system"` and updates automatically.
 */
export default function ModeContextProvider({
  children,
  defaultMode = 'system',
  storageKey = 'app_mode',
}: ModeContextProviderProps) {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem(storageKey) as Mode | null) ?? defaultMode
  })
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return mode === 'system' ? prefersDarkMediaQuery.matches : mode === 'dark'
  })

  /*
    Applies the current mode.
    Also, if mode is `system`, listen for system mode changes.
  */
  useEffect(() => {
    applyMode(mode)

    if (mode !== 'system') {
      return
    }

    const listener = () => {
      applyMode('system')
      setIsDarkMode(prefersDarkMediaQuery.matches)
    }
    prefersDarkMediaQuery.addEventListener('change', listener)

    return () => {
      prefersDarkMediaQuery.removeEventListener('change', listener)
    }
  }, [mode])

  //  Changes the current mode and persists it in localStorage.
  const changeMode = useCallback(
    (newMode: Mode) => {
      setMode(newMode)
      if (newMode !== 'system') {
        setIsDarkMode(newMode === 'dark')
      } else {
        setIsDarkMode(prefersDarkMediaQuery.matches)
      }
      localStorage.setItem(storageKey, newMode)
    },
    [storageKey],
  )

  const ctx = {
    mode,
    isDarkMode,
    changeMode,
  }

  return <ModeContext.Provider value={ctx}>{children}</ModeContext.Provider>
}
