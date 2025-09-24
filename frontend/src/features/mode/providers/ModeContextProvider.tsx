import { useCallback, useEffect, useMemo, useState } from 'react'

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
 *
 * @component
 * @example
 * ```tsx
 * <ModeContextProvider defaultMode="system" storageKey="my-app-mode">
 *   <App />
 * </ModeContextProvider>
 * ```
 *
 * @param props - Component props.
 * @param props.children - The child components that should have access to the mode context.
 * @param props.defaultMode="system" - The default mode if no preference is stored.
 * @param props.storageKey="mode" - The key to store mode preference in localStorage.
 *
 * @returns {JSX.Element} The context provider wrapping children.
 */
export default function ModeContextProvider({
  children,
  defaultMode = 'system',
  storageKey = 'mode',
}: ModeContextProviderProps) {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem(storageKey) as Mode | null) ?? defaultMode
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
    }
    prefersDarkMediaQuery.addEventListener('change', listener)

    return () => {
      prefersDarkMediaQuery.removeEventListener('change', listener)
    }
  }, [mode])

  /**
   * Changes the current mode and persists it in localStorage.
   *
   * @param newMode - The new mode to set.
   */
  const changeMode = useCallback(
    (newMode: Mode) => {
      setMode(newMode)
      localStorage.setItem(storageKey, newMode)
    },
    [storageKey],
  )

  const ctx = useMemo(
    () => ({
      mode,
      changeMode,
    }),
    [mode, changeMode],
  )

  return <ModeContext.Provider value={ctx}>{children}</ModeContext.Provider>
}
