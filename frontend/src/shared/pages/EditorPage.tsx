import {
  CodeEditor,
  EditorActions,
  EditorOutput,
  LanguageSelect,
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
      <div className="h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={50}
            minSize={25}
            maxSize={75}
            className="grid grid-rows-[auto_1fr] gap-2"
          >
            <LanguageSelect />
            <CodeEditor />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel
            defaultSize={50}
            maxSize={75}
            minSize={25}
            className="grid grid-rows-[auto_1fr] gap-2"
          >
            <EditorActions />
            <EditorOutput />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </EditorContextProvider>
  )
}
