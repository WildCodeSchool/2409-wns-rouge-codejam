import { Suspense } from 'react'

import { Editor, Output } from '@/features/editor/components/editor'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { Spinner } from '@/shared/components/ui/spinner'

export default function HomePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={25} maxSize={75}>
          <div className="flex h-full">
            <Editor
              defaultLanguage="javascript"
              defaultValue=""
              value='console.log("Hello, World!")'
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} maxSize={75} minSize={25}>
          <div className="flex h-full">
            <Output value='Click "Run code" to visualize the output here...' />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Suspense>
  )
}
