import { Suspense } from 'react'

import { EditorContainer } from '@/features/editor/components'

export default function HomePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditorContainer />
    </Suspense>
  )
}
