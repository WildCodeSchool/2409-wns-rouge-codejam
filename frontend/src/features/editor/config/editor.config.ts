import type * as monaco from 'monaco-editor'

import { MonacoTheme } from '@/features/editor/types'
import { Mode } from '@/features/mode/types'
import { Language } from '@/shared/gql/graphql'

export const BASE_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    cursorBlinking: 'phase',
    fontFamily: 'Fira Code, monospace', // requires Fira Code font to be self-hosted and provided via the `@font-face` directive (see `index.css` file)
    fontLigatures: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: false },
    lineDecorationsWidth: 0, // disable line decorations width to avoid extra space on the left
    lineNumbersMinChars: 3, // minimum number of characters to reserve for line numbers
    padding: {
      top: 16,
    },
    renderLineHighlight: 'gutter',
    tabSize: 2, // set tab size to 2 spaces
    wrappingStrategy: 'advanced', // use advanced wrapping strategy for better performance
    wordWrap: 'bounded', // wrap at min(viewport width, wordWrapColumn)
    wordWrapColumn: 80, // set word wrap column to 80 characters
    wrappingIndent: 'indent', // indent wrapped lines
  }

/*
  Custom themes defined in `./themes/*.json`.
  These themes need to be registered manually using the `defineTheme` utility function.

  More themes available at: https://github.com/brijeshb42/monaco-themes/tree/master/themes
 */
export const CUSTOM_THEMES = ['github-dark', 'dreamweaver'] as const

// Monaco built-in themes
export const DEFAULT_THEMES = ['vs', 'vs-dark', 'hc-light', 'hc-black'] as const

export const STARTER_SNIPPETS: Record<Language, string> = {
  JAVASCRIPT: `function greet(name) {\n  console.log('Hello, ' + name + '!');\n}\ngreet('World');\n`,
  TYPESCRIPT: `function greet(name: string): void {\n  console.log('Hello, ' + name + '!');\n}\ngreet('World');\n`,
}

// Mapping object that associates editor modes (excluding `system`) with their corresponding Monaco editor theme names
export const THEME_MAP: Record<Exclude<Mode, 'system'>, MonacoTheme> = {
  dark: 'github-dark',
  light: 'dreamweaver',
}
