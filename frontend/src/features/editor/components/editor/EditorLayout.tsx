import {
  CodeEditor,
  CodeEditorSkeleton,
  EditorActions,
  EditorActionsSkeleton,
  EditorOutput,
  EditorOutputSkeleton,
  LanguageSelect,
  LanguageSelectSkeleton,
} from '@/features/editor/components/editor'
import { EditorState } from '@/features/editor/reducers'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { ExecutionStatus } from '@/shared/gql/graphql'

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
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className="grid grid-rows-[auto_1fr] gap-2"
        >
          <LanguageSelect
            language={state.language}
            onChange={onChangeLanguage}
          />

          <CodeEditor
            code={state.code}
            language={state.language}
            onChange={onChangeCode}
          />
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-transparent" />

        <ResizablePanel
          defaultSize={50}
          maxSize={75}
          minSize={25}
          className="grid grid-rows-[auto_1fr] gap-2"
        >
          <EditorActions
            code={state.code}
            language={state.language}
            onChangeOutput={onChangeOutput}
            onChangeStatus={onChangeStatus}
          />
          <EditorOutput output={state.output} status={state.executionStatus} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export function EditorPageSkeleton() {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel className="grid grid-rows-[auto_1fr] gap-2">
        <LanguageSelectSkeleton />
        <CodeEditorSkeleton />
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-transparent" />
      <ResizablePanel className="grid grid-rows-[auto_1fr] gap-2">
        <EditorActionsSkeleton />
        <EditorOutputSkeleton />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
