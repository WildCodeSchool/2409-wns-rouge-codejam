import Editor from '@monaco-editor/react'
import { memo } from 'react'

const EditorContainer = memo(function EditorContainer() {
  return <Editor defaultLanguage="javascript" theme="vs-dark" />
})

export default EditorContainer
