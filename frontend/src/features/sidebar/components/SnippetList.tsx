import { Snippet } from '@/features/sidebar/components'

import { Spinner } from '@/shared/components/ui/spinner'
import { useAppContext } from '@/shared/hooks'

export default function SnippetList() {
  const { snippets, errorSnippets, loadingSnippets } = useAppContext()

  if (loadingSnippets) {
    return <Spinner show size="small" className="mx-auto my-4" />
  }

  if (errorSnippets) {
    return <p>Failed to retrieve snippets...</p>
  }

  return (
    <>
      {snippets.map((snippet) => (
        <Snippet key={snippet.id} id={snippet.id} slug={snippet.slug}>
          {snippet.name}
        </Snippet>
      ))}
    </>
  )
}
