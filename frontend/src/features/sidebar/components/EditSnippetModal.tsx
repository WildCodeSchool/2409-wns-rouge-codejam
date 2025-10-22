import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

import { snippetEditSchema, SnippetEditType } from '@/features/auth/schemas'

import Modal, { ModalProps } from '@/shared/components/Modal'
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
import { Snippet } from '@/shared/gql/graphql'

type EditSnippetModalProps = ModalProps & {
  edit: boolean
  snippetName: Snippet['name']
  onCancel: () => void
  onConfirm: (values: SnippetEditType) => Promise<void>
}

export default function EditSnippetModal({
  open,
  onOpenChange,
  edit,
  snippetName,
  onCancel,
  onConfirm,
}: EditSnippetModalProps) {
  const initialNameRef = useRef<Snippet['id']>(snippetName)
  const form = useForm<SnippetEditType>({
    defaultValues: {
      name: snippetName,
    },
    resolver: zodResolver(snippetEditSchema),
    mode: 'onChange',
    shouldFocusError: true,
  })

  const isSubmitting = form.formState.isSubmitting
  const hasError = Object.keys(form.formState.errors).length > 0
  const hasChanged = form.watch('name') !== initialNameRef.current

  return (
    <Modal
      title={`${edit ? 'Rename' : 'Create'} Snippet`}
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        form.reset()
        onOpenChange?.(nextOpen)
      }}
    >
      <Form {...form}>
        <form
          aria-label={` ${edit ? 'rename' : 'create '} snippet form'`}
          onSubmit={form.handleSubmit(async (values) => {
            await onConfirm(values)
            form.reset()
            onCancel()
          })}
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
                  <FormControl>
                    <Input
                      required
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                      type="text"
                      placeholder={!edit ? 'Snippet name' : ''}
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
              id={'cancel-operation'}
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                form.reset()
                onCancel()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              id={`${edit ? 'rename' : 'create'}-snippet-submit`}
              className="min-w-36"
              disabled={isSubmitting || hasError || !hasChanged}
            >
              {isSubmitting ? (
                <Spinner show size="small" />
              ) : (
                `${edit ? 'Rename' : 'Create'} Snippet`
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  )
}
