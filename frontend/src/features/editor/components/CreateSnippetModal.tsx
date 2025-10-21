import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import {
  snippetCreateSchema,
  SnippetCreateType,
} from '@/features/auth/schemas/formSchema'

import { CREATE_SNIPPET } from '@/shared/api/createSnippet'
import { GET_ALL_SNIPPETS } from '@/shared/api/getUserSnippets'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner'
import { toastOptions } from '@/shared/config'
import { CreateSnippetMutation, Snippet } from '@/shared/gql/graphql'

type CreateSnippetModalProps = {
  language: Snippet['language']
  onClose: () => void
}

export default function CreateSnippetModal({
  language,
  onClose,
}: CreateSnippetModalProps) {
  const navigate = useNavigate()
  const [createSnippet] = useMutation<CreateSnippetMutation>(CREATE_SNIPPET)
  const form = useForm<SnippetCreateType>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(snippetCreateSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const handleChange = (
    e: React.FormEvent<HTMLElement>,
    onChange: (...event: unknown[]) => void,
  ) => {
    onChange(e)
    if (e.target instanceof HTMLInputElement) {
      form.clearErrors(e.target.name as keyof SnippetCreateType)
      form.clearErrors('root')
    }
  }
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

      toast.success('Snippet created successfully', {
        ...toastOptions.success,
        description: `"${values.name}" was added to your snippets.`,
      })

      onClose()
    } catch (err: unknown) {
      console.error(err)
      toast.error("Oops! We couldn't create your snippet...", {
        ...toastOptions.error,
      })
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form
        data-testid="create-snippet-form"
        aria-label="create-snippet form"
        onSubmit={form.handleSubmit(handleCreateSnippet)}
        className="space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Name<span className="text-destructive-foreground">*</span>
                </FormLabel>
                <FormControl
                  onChange={(e) => {
                    handleChange(e, field.onChange)
                  }}
                >
                  <Input
                    // 👇 Legitimate case with no accessibility issues
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    required
                    type="text"
                    placeholder="Snippet name"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage role="alert" />
              </FormItem>
            )
          }}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            id="create-snippet-cancel"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            id="create-snippet-submit"
            variant="default"
            disabled={isSubmitting}
            className="min-w-33"
          >
            {isSubmitting ? <Spinner show size="small" /> : 'Create Snippet'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
