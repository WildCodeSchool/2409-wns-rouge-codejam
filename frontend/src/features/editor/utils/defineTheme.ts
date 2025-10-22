import { loader, Monaco } from '@monaco-editor/react'

import { MonacoThemeOptions } from '@/features/editor/types'

/**
 * Dynamically loads and registers a Monaco Editor theme from a JSON file.
 *
 * @param theme - The name of the theme (must match a JSON file in `../themes/`).
 * @returns A promise that resolves when the theme has been successfully registered.
 */
export default async function defineTheme(theme: string): Promise<void> {
  const [monaco, themeData] = await Promise.all([
    loader.init() as Promise<Monaco>, // Get monaco instance
    import(`../themes/${theme}.json`) as Promise<MonacoThemeOptions>, // Import theme file
  ])

  monaco.editor.defineTheme(theme, themeData)
}
