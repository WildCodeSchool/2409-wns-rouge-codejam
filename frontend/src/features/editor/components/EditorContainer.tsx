import Editor from '@monaco-editor/react'
import { useState } from 'react'

const EditorContainer = () => {
  const [code, setCode] = useState<string>()

  return (
    <Editor
      defaultLanguage="javascript"
      theme="vs-dark"
      onChange={setCode}
      value={code}
    />
  )
}

export default EditorContainer
