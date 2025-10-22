import { THEME_MAP } from '@/features/editor/config'

import { MonacoTheme } from '@/features/editor/types'
import { Mode } from '@/features/mode/types'
import { prefersDarkMediaQuery } from '@/features/mode/utils'

/**
 * Resolves the appropriate Monaco editor theme based on the current mode.
 *
 * @param mode - The current theme mode (`dark`, `light`, or `system`).
 * @returns The resolved Monaco editor theme name.
 */
export default function resolveEditorTheme(mode: Mode): MonacoTheme {
  if (mode === 'system') {
    return prefersDarkMediaQuery.matches ? THEME_MAP.dark : THEME_MAP.light
  }
  if (!(mode in THEME_MAP)) {
    throw new Error(`No theme available for the selected mode ${mode}`)
  }
  return THEME_MAP[mode]
}
