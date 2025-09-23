import { CREATE_SNIPPET } from '@/shared/api/createSnippet'
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
} from '@/features/auth/schemas/formSchema'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { CreateSnippetMutation, Snippet } from '@/shared/gql/graphql'

type CreateSnippetModalProps = {
  language: Snippet['language']
  onClose: () => void
}

export default function CreateSnippetModal({
  language,
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

  return (
    <Form {...form}>
      <form
        aria-label="create snippet form"
        onSubmit={form.handleSubmit(handleCreateSnippet)}
      >
        <Input
          className="text-foreground bg-input mb-2 w-full rounded border p-2"
          {...form.register('name')}
          placeholder="Snippet name"
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
            id="create-snippet-cancel"
            className={`bg-foreground rounded ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={isSubmitting || isSubmittingError.length > 0}
            onClick={onClose}
          >
            {isSubmitting ? <Spinner show size="small" /> : 'Cancel'}
          </Button>
          <Button
            type="submit"
            id="create-snippet-submit"
            className={`bg-foreground rounded ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={
              !form.formState.isValid ||
              isSubmitting ||
              isSubmittingError.length > 0
            }
          >
            {isSubmitting ? <Spinner show size="small" /> : 'Create Snippet'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
