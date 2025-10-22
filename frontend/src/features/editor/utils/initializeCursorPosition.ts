import { MonacoEditorInstance } from '@/features/editor/types'

/**
 * Focuses the Monaco Editor instance and moves the cursor to the end of the provided code.
 *
 * @param editor - The Monaco Editor instance to operate on.
 * @param code - The code currently in the editor (used to compute the cursor position).
 */
export default function initializeCursorPosition(
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
