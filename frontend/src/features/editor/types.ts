import type { editor } from 'monaco-editor'

import { CUSTOM_THEMES, DEFAULT_THEMES } from '@/features/editor/config'

export type EditorStatus = 'typing' | 'executing' | 'disabled' | 'saving'

export type EditorUrlParams = {
  snippetId: string
  snippetSlug: string
}

export type MonacoCustomTheme = (typeof CUSTOM_THEMES)[number]

export type MonacoDefaultTheme = (typeof DEFAULT_THEMES)[number]

export type MonacoTheme = MonacoCustomTheme | MonacoDefaultTheme

export type MonacoThemeOptions = editor.IStandaloneThemeData

export type MonacoEditorInstance = editor.IStandaloneCodeEditor
