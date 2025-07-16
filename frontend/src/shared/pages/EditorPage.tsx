import {
  CodeEditor,
  EditorHeader,
  EditorOutput,
} from '@/features/editor/components/editor'
import { EditorContextProvider } from '@/features/editor/providers'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'

export default function EditorPage() {
  return (
    <EditorContextProvider>
      <div className="grid h-full grid-rows-[auto_1fr] gap-4">
        <EditorHeader />

        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={25} maxSize={75}>
            <CodeEditor />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} maxSize={75} minSize={25}>
            <EditorOutput />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </EditorContextProvider>
  )
}
