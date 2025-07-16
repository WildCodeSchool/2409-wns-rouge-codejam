import { EditorActions } from '@/features/editor/components/editor'

export default function EditorHeader() {
  return (
    <div className="flex min-h-10 items-center justify-between">
      <EditorActions />
      <div>🚧 Other actions...</div>
    </div>
  )
}
