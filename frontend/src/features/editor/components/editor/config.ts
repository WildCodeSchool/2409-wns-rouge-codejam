import type * as monaco from 'monaco-editor'

// !TODO: add extra options (if needed)...

export const baseEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    // automaticLayout: true, // automatically grows on resize
    cursorBlinking: 'phase',
    fontFamily: 'Fira Code, monospace', // requires Fira Code font to be self-hosted and provided via the `@font-face` directive (see `index.css` file)
    fontLigatures: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: false },

    // acceptSuggestionOnCommitCharacter: true, // default to `true`
    // acceptSuggestionOnEnter: 'on', // default to `on`
    // autoClosingBrackets: "languageDefined", // default to `languageDefined`
    // autoClosingComments: 'languageDefined', // default to `languageDefined`
    // autoClosingOvertype: 'auto', // default to `auto`
    // autoClosingQuotes: 'languageDefined', // default to `languageDefined`
    // autoIndent: 'advanced', // default to `advanced`
    // bracketPairColorization: {
    //   enabled: true, // default to `true`
    // },

    // scrollBeyondLastLine: false,
    // fontSize: 14,
    // lineNumbers: 'on',
    // wordWrap: 'on',
    // wrappingIndent: 'indent',
    // renderLineHighlight: 'all',
    // fontFamily: 'Fira Code, monospace',
    // fontLigatures: true,
    // tabSize: 2,
    // cursorStyle: 'line',
    // cursorBlinking: 'phase',
    // quickSuggestions: true,
    // suggestOnTriggerCharacters: true,
    // acceptSuggestionOnEnter: 'on',
    // autoClosingBrackets: 'languageDefined',
    // autoClosingQuotes: 'languageDefined',
    // autoIndent: 'advanced',
    // formatOnType: true,
    // formatOnPaste: true,
    // folding: true,
    // foldingStrategy: 'auto',
    // renderWhitespace: 'selection',
    // renderControlCharacters: true,
    // overviewRulerLanes: 3,
    // overviewRulerBorder: true,
    // scrollbar: {
    //   vertical: 'auto',
    //   horizontal: 'auto',
    //   useShadows: false,
    //   verticalHasArrows: false,
    //   horizontalHasArrows: false,
    //   arrowSize: 11,
    //   alwaysConsumeMouseWheel: false,
    // },
    // contextmenu: true,
    // selectionHighlight: true,
    // occurrencesHighlight: 'singleFile',
    // fixedOverflowWidgets: true,
    // accessibilitySupport: 'auto',
    // renderFinalNewline: 'on',
    // renderValidationDecorations: 'editable',
  }
