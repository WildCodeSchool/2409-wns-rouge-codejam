import {
  CodeEditor,
  CodeEditorSkeleton,
  EditorLeftActions,
  EditorLeftActionsSkeleton,
  EditorOutput,
  EditorOutputSkeleton,
  EditorRightActions,
  EditorRightActionsSkeleton,
  EditorSidebar,
  EditorSidebarSkeleton,
} from '@/features/editor/components'
import { EditorState } from '@/features/editor/reducers'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { ExecutionStatus } from '@/shared/gql/graphql'
import { SidebarProvider } from '@/shared/components/ui/sidebar'

type EditorLayoutProps = {
  state: EditorState
  onChangeCode: (nextCode?: string) => void
  onChangeLanguage: (nextLanguage: string) => void
  onChangeOutput: (nextOutput?: string) => void
  onChangeStatus: (nextStatus?: ExecutionStatus) => void
}

export default function EditorLayout({
  state,
  onChangeCode,
  onChangeLanguage,
  onChangeOutput,
  onChangeStatus,
}: EditorLayoutProps) {
  return (
    <div className="flex h-full">
      <SidebarProvider className="gap-2">
        <EditorSidebar language={state.language} />

        <ResizablePanelGroup direction="horizontal" className="h-full gap-2">
          <ResizablePanel
            id="editor-panel"
            defaultSize={50}
            minSize={25}
            maxSize={75}
            className="grid grid-rows-[auto_1fr] gap-2 pt-2 pl-2"
          >
            <EditorLeftActions
              code={state.code}
              language={state.language}
              onChangeLanguage={onChangeLanguage}
            />

            <CodeEditor
              code={state.code}
              language={state.language}
              onChange={onChangeCode}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel
            id="output-panel"
            defaultSize={50}
            minSize={25}
            maxSize={75}
            className="grid grid-rows-[auto_1fr] gap-2 pt-2 pr-2"
          >
            <EditorRightActions
              code={state.code}
              language={state.language}
              onChangeOutput={onChangeOutput}
              onChangeStatus={onChangeStatus}
            />
            <EditorOutput
              output={state.output}
              status={state.executionStatus}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </div>
  )
}

export function EditorPageSkeleton() {
  return (
    <div className="flex h-full">
      <SidebarProvider className="gap-2">
        <EditorSidebarSkeleton />
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel className="grid grid-rows-[auto_1fr] gap-2">
            <EditorLeftActionsSkeleton />
            <CodeEditorSkeleton />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-transparent" />
          <ResizablePanel className="grid grid-rows-[auto_1fr] gap-2">
            <EditorRightActionsSkeleton />
            <EditorOutputSkeleton />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </div>
  )
}
