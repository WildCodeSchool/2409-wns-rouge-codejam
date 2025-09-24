import { loader, Monaco } from '@monaco-editor/react'

import { THEME_MAP } from '@/features/editor/config'

import {
  MonacoEditorInstance,
  MonacoTheme,
  MonacoThemeOptions,
} from '@/features/editor/types'
import { Mode } from '@/features/mode/types'
import { prefersDarkMediaQuery } from '@/features/mode/utils'

/**
 * Dynamically loads and registers a Monaco Editor theme from a JSON file.
 *
 * @param theme - The name of the theme (must match a JSON file in `../themes/`).
 * @returns A promise that resolves when the theme has been successfully registered.
 */
export async function defineTheme(theme: string): Promise<void> {
  const [monaco, themeData] = await Promise.all([
    loader.init() as Promise<Monaco>, // Get monaco instance
    import(`../themes/${theme}.json`) as Promise<MonacoThemeOptions>, // Import theme file
  ])

  monaco.editor.defineTheme(theme, themeData)
}

/**
 * Focuses the Monaco Editor instance and moves the cursor to the end of the provided code.
 *
 * @param editor - The Monaco Editor instance to operate on.
 * @param code - The code currently in the editor (used to compute the cursor position).
 */
export function initializeCursorPosition(
  editor: MonacoEditorInstance,
  code: string,
) {
  // Focus the editor
  editor.focus()

  // Set the cursor position at the end of the code
  const model = editor.getModel()
  if (!model) {
    return
  }
  const lastLine = model.getLineCount()
  const position = editor.getPosition()
  if (position) {
    const nextLinePosition = lastLine - 1
    const nextColumnPosition = code.length > 0 ? code.length + 1 : 0
    editor.setPosition({
      lineNumber: nextLinePosition,
      column: nextColumnPosition,
    })
  }
}

/**
 * Resolves the appropriate Monaco editor theme based on the current mode.
 *
 * @param mode - The current theme mode (`dark`, `light`, or `system`).
 * @returns The resolved Monaco editor theme name.
 */
export function resolveEditorTheme(mode: Mode): MonacoTheme {
  if (mode === 'system') {
    return prefersDarkMediaQuery.matches ? THEME_MAP.dark : THEME_MAP.light
  }
  return THEME_MAP[mode] ?? THEME_MAP.dark
}
