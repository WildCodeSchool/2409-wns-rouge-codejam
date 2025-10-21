/**
 * Formats a keyboard shortcut string into a standardized display form.
 *
 * @param shortcut - The raw keyboard shortcut identifier (e.g. from a KeyboardEvent code).
 * @returns The formatted, human-readable shortcut string.
 */
export default function formatKeyboardShortcut(shortcut: string) {
  return shortcut.toLowerCase().replace(/Key/i, '').toUpperCase()
}
