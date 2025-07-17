import { Suspense, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Snippet } from '../gql/graphql'
import EditorContainer from '@/features/editor/components/EditorContainer'
import { useQuery } from '@apollo/client'
import { GET_MY_SNIPPETS } from '../api/whoAmI'

const HomePage = () => {
  const [openedSnippets, setOpenedSnippets] = useState<Snippet[]>([])
  const [activeTab, setActiveTab] = useState<string>()
  const { data, loading, error } = useQuery(GET_MY_SNIPPETS)

  useEffect(() => {
    if (data && !loading && !error) {
      console.log(data?.whoAmI?.snippets)
      setOpenedSnippets(data?.whoAmI?.snippets)
    }
  }, [data])

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Tabs>
        <TabsList>
          {openedSnippets.map((snippet) => {
            return (
              <TabsTrigger key={snippet.id} value={snippet.id}>
                {snippet.name}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
      <EditorContainer />
    </Suspense>
  )
}

export default HomePage
