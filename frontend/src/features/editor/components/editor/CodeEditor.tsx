import { CREATE_SNIPPET } from '@/shared/api/createSnippet'
import { UPDATE_SNIPPET } from '@/shared/api/updateSnippet'
import { Language, Snippet, UserRole } from '@/shared/gql/graphql'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import Editor from '@monaco-editor/react'
import { useState } from 'react'
import SaveButton from './SaveButton'
import { toast } from 'sonner'
import { WHO_AM_I } from '@/shared/api/whoAmI'

type CodeEditorProps = {
  snippet?: Snippet
}

const CodeEditor = ({ snippet }: CodeEditorProps) => {
  const [snippetCode, setSnippetCode] = useState(snippet?.code ?? '')
  const [snippetLanguage] = useState(snippet?.language ?? Language.Javascript)
  const [snippetName] = useState(snippet?.name ?? 'Default')
  const [snippetId, setSnippetId] = useState<string | undefined>(snippet?.id)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [updateSnippet] = useMutation(UPDATE_SNIPPET)
  const [createSnippet] = useMutation(CREATE_SNIPPET)
  const { data: { whoAmI: user } = {} } = useSuspenseQuery(WHO_AM_I)

  const isUserLoggedIn = user !== null && user !== undefined
  const isUserGuest = user?.role === UserRole.Guest

  async function handleSave() {
    try {
      setIsSaving(true)

      // If a snippet exists, we update it, otherwise we create a new one
      if (snippetId) {
        await updateSnippet({
          variables: {
            data: {
              code: snippetCode,
              language: snippetLanguage,
              name: snippetName,
            },
            updateSnippetId: snippetId,
          },
        })
      } else {
        const { data } = await createSnippet({
          variables: {
            data: {
              code: snippetCode,
              language: snippetLanguage,
              name: snippetName,
            },
          },
        })

        if (data?.createSnippet) {
          setSnippetId(data.createSnippet.id)
        }
      }

      toast.success('Successfully saved')
    } catch (err) {
      toast.error('Failed to save', {
        description: err instanceof Error ? err.message : JSON.stringify(err),
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col items-end justify-around gap-2">
      {
        // TODO: To move at the right place when PR #100 is merged

        snippetCode && isUserLoggedIn && (
          <SaveButton onClick={handleSave} loading={isSaving} />
        )
      }
      <Editor
        value={snippetCode}
        onChange={(value) => {
          if (value) {
            setSnippetCode(value)
          }
        }}
        defaultLanguage="javascript"
        theme="vs-dark"
      />
    </div>
  )
}

export default CodeEditor
