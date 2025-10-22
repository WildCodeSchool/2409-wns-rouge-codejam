import { Mode, MODE_OPTIONS } from '@/features/mode/types'

export const prefersDarkMediaQuery = window.matchMedia(
  '(prefers-color-scheme: dark)',
)

/**
 * Applies the given mode to the document root element (`<html>`).
 *
 * - Removes any existing `light`, `dark` or `system` classes.
 * - If mode is `"system"`, applies both `system` and the resolved mode.
 * - Otherwise applies only `light` or `dark`.
 *
 * @param mode - The mode to apply (`"light"`, `"dark"`, or `"system"`).
 */
export function applyMode(mode: Mode) {
  const root = window.document.documentElement
  root.classList.remove(...Object.values(MODE_OPTIONS))

  if (mode === 'system') {
    const resolved = prefersDarkMediaQuery.matches ? 'dark' : 'light'
    // Add both 'system' and the resolved mode class (allow the dropdown mode select to also support system)
    root.classList.add('system', resolved)
  } else {
    root.classList.add(mode)
  }
}
