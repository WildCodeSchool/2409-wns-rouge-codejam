import { Suspense } from 'react'
import EditorContainer from '@/features/editor/components/EditorContainer'

const HomePage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditorContainer />
    </Suspense>
  )
}

export default HomePage
