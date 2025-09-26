import { CREATE_SNIPPET } from '@/shared/api/createSnippet'
import { UPDATE_SNIPPET } from '@/shared/api/updateSnippet'
import { useMutation } from '@apollo/client'
import { Form } from '@/shared/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/shared/components/ui/input'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { Spinner } from '@/shared/components/ui/spinner'
import { Button } from '@/shared/components/ui/button'
import {
  snippetCreateSchema,
  SnippetCreateType,
  SnippetRenameType,
} from '@/features/auth/schemas/formSchema'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import {
  CreateSnippetMutation,
  Snippet,
  UpdateSnippetMutation,
} from '@/shared/gql/graphql'

type CreateSnippetModalProps = {
  language: Snippet['language']
  isSnippetCreation: boolean
  currentName: string | undefined
  selectedSnippetId: string | undefined
  onClose: () => void
}

export default function CreateSnippetModal({
  language,
  isSnippetCreation,
  currentName,
  selectedSnippetId,
  onClose,
}: CreateSnippetModalProps) {
  const form = useForm<SnippetCreateType>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(snippetCreateSchema),
    reValidateMode: 'onBlur',
    shouldFocusError: true,
  })

  const isSubmitting = form.formState.isSubmitting
  const isSubmittingError = Object.keys(form.formState.errors)
  const navigate = useNavigate()

  const [createSnippet] = useMutation<CreateSnippetMutation>(CREATE_SNIPPET)
  const [renameSnippet] = useMutation<UpdateSnippetMutation>(UPDATE_SNIPPET)

  const handleCreateSnippet = async (values: SnippetCreateType) => {
    try {
      const snippet = await createSnippet({
        variables: {
          data: {
            name: values.name,
            code: '',
            language,
          },
        },
        refetchQueries: [GET_ALL_SNIPPETS],
      })

      if (snippet.data?.createSnippet) {
        navigate(
          `/editor/${snippet.data.createSnippet.id}/${snippet.data.createSnippet.slug}`,
        )
      }

      toast.success(`Snippet ${values.name} created successfully`)

      onClose()
    } catch (err) {
      toast.error(`Error while creating your snippet`, {
        description: err instanceof Error ? err.message : JSON.stringify(err),
      })
    }
  }
  const handleRenameSnippet = async (values: SnippetRenameType) => {
    try {
      const snippet = await renameSnippet({
        variables: {
          data: {
            name: values.name,
          },
          updateSnippetId: selectedSnippetId,
        },
        refetchQueries: [GET_ALL_SNIPPETS],
      })
      if (snippet.data?.updateSnippet) {
        navigate(
          `/editor/${snippet.data.updateSnippet.id}/${snippet.data.updateSnippet.slug}`,
        )
      }
      toast.success(`Snippet ${values.name} renamed successfully`)
      onClose()
    } catch (err) {
      toast.error(`Error while renaming your snippet`, {
        description: err instanceof Error ? err.message : JSON.stringify(err),
      })
    }
  }

  return (
    <Form {...form}>
      <form
        aria-label={` ${isSnippetCreation ? 'create ' : 'rename '} snippet form'`}
        onSubmit={form.handleSubmit(
          isSnippetCreation ? handleCreateSnippet : handleRenameSnippet,
        )}
      >
        <Input
          className="text-foreground bg-input mb-2 w-full rounded border p-2"
          {...form.register('name')}
          placeholder={isSnippetCreation ? 'Snippet name' : currentName}
          autoFocus
          disabled={isSubmitting}
        />
        {form.formState.errors.name && (
          <div className="mb-2 text-sm text-red-600">
            {form.formState.errors.name.message}
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            id={'cancel-operation'}
            className={`bg-foreground rounded ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={isSubmitting || isSubmittingError.length > 0}
            onClick={onClose}
          >
            {isSubmitting ? <Spinner show size="small" /> : 'Cancel'}
          </Button>
          <Button
            type="submit"
            id={`${isSnippetCreation ? 'create' : 'rename'}-snippet-submit`}
            className={`bg-foreground rounded ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={
              !form.formState.isValid ||
              isSubmitting ||
              isSubmittingError.length > 0
            }
          >
            {isSubmitting ? (
              <Spinner show size="small" />
            ) : (
              `${isSnippetCreation ? 'Create' : 'Rename'} Snippet`
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
