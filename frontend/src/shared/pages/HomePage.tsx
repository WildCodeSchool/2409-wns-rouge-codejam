import { Suspense } from 'react'
import CodeEditor from '@/features/editor/components/editor/CodeEditor'

const HomePage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CodeEditor />
    </Suspense>
  )
}

export default HomePage
