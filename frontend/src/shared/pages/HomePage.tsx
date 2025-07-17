import { Suspense } from 'react'
import EditorContainer from '@/features/editor/components/EditorContainer'
import EditorSidebar from '../../features/editor/components/EditorSidebar'

const HomePage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="flex h-screen">
        <div className="h-screen flex-shrink-0">
          <EditorSidebar />
        </div>
        <div className="min-w-0 flex-1">
          <EditorContainer />
        </div>
      </div>
    </Suspense>
  )
}

export default HomePage
