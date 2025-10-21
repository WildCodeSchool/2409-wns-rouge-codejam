import {
  CodeEditor,
  CodeEditorSkeleton,
  EditorLeftActions,
  EditorLeftActionsSkeleton,
  EditorOutput,
  EditorOutputSkeleton,
  EditorRightActions,
  EditorRightActionsSkeleton,
} from '@/features/editor/components'
import { SidebarLayout } from '@/features/sidebar/components'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { SidebarProvider } from '@/shared/components/ui/sidebar'
import { useIsDesktop, useIsMobile } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

export default function EditorLayout() {
  const isMobile = useIsMobile()
  const isDesktop = useIsDesktop()

  return (
    <div className="flex h-full gap-4">
      <SidebarLayout />

      <div className="grid h-full flex-1 grid-rows-[auto_1fr]">
        <div
          className={cn(
            'flex items-center justify-between',
            isMobile ? 'px-2' : 'pt-1 pr-2',
          )}
        >
          <EditorLeftActions />
          <EditorRightActions />
        </div>

        <ResizablePanelGroup
          direction={!isDesktop ? 'vertical' : 'horizontal'}
          className={cn('h-full', !isDesktop ? 'px-2 pb-2' : 'gap-2 pr-2')}
        >
          <ResizablePanel
            id="editor-panel"
            defaultSize={50}
            minSize={25}
            maxSize={75}
          >
            <CodeEditor />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel
            id="output-panel"
            defaultSize={50}
            minSize={25}
            maxSize={75}
            className="overflow-hidden rounded-md"
          >
            <EditorOutput
              className={cn(
                'relative flex h-full overflow-hidden rounded-md border border-transparent',
                isDesktop && 'mt-4',
              )}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export function EditorPageSkeleton() {
  const isMobile = useIsMobile()

  return (
    <div className="flex h-full">
      <SidebarProvider className="flex-col gap-0">
        <div className="grid h-full flex-1 grid-rows-[auto_1fr]">
          <div className="flex items-center justify-between px-2 pt-1">
            <EditorLeftActionsSkeleton />
            <EditorRightActionsSkeleton />
          </div>
        </div>

        <ResizablePanelGroup
          direction={isMobile ? 'vertical' : 'horizontal'}
          className={cn('h-full', !isMobile && 'gap-2')}
        >
          <ResizablePanel
            id="editor-panel"
            defaultSize={50}
            minSize={25}
            maxSize={75}
          >
            <CodeEditorSkeleton />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel
            id="output-panel"
            defaultSize={50}
            minSize={25}
            maxSize={75}
            className="overflow-hidden rounded-md"
          >
            <EditorOutputSkeleton />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </div>
  )
}
