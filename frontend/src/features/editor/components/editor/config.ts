import type * as monaco from 'monaco-editor'

import { Language } from '@/shared/gql/graphql'

export const STARTER_SNIPPET: Record<Language, string> = {
  JAVASCRIPT: `function greet(name) {\n  console.log('Hello, ' + name + '!');\n}\ngreet('World');\n`,
  TYPESCRIPT: `function greet(name: string): void {\n  console.log('Hello, ' + name + '!');\n}\ngreet('World');\n`,
}

export const BASE_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    cursorBlinking: 'phase',
    fontFamily: 'Fira Code, monospace', // requires Fira Code font to be self-hosted and provided via the `@font-face` directive (see `index.css` file)
    fontLigatures: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: false },
    lineDecorationsWidth: 0, // disable line decorations width to avoid extra space on the left
    lineNumbersMinChars: 3, // minimum number of characters to reserve for line numbers
    tabSize: 2, // set tab size to 2 spaces
    wrappingStrategy: 'advanced', // use advanced wrapping strategy for better performance
    wordWrap: 'bounded', // wrap at min(viewport width, wordWrapColumn)
    wordWrapColumn: 80, // set word wrap column to 80 characters
    wrappingIndent: 'indent', // indent wrapped lines
  }
