import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CREATE_USER } from '@/shared/api/createUser'
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
import PasswordTooltip from '@/features/auth/components/PasswordTooltip'
import PasswordVisibiltyInput from '@/features/auth/components/PasswordVisibiltyInput'
import { formSchema, SignInFormType } from '@/features/auth/schemas/formSchema'

type SignInFormPropsType = {
  callbackOnSubmit?: () => void
}

const SignInForm = (props: SignInFormPropsType) => {
  const [createUser] = useMutation(CREATE_USER)

  const form = useForm<SignInFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur', // 	validation strategy before submitting
    reValidateMode: 'onBlur', // validation strategy after submitting
    shouldFocusError: true, // focus first field with an error if the form that fails validation ()
  })

  const isSubmitting = form.formState.isSubmitting

  const handleChange = (
    e: React.FormEvent<HTMLElement>,
    onChange: (...event: unknown[]) => void,
  ) => {
    onChange(e)
    if (e.target instanceof HTMLInputElement) {
      form.clearErrors(e.target.name as keyof SignInFormType)
    }
  }

  const onSubmit = async (values: SignInFormType) => {
    try {
      const { data } = await createUser({
        variables: {
          data: {
            username: values.username,
            email: values.email,
            password: values.password,
          },
        },
      })

      if (data?.createUser) {
        toast.success(`Welcome ${data.createUser.username ?? 'Codejamer'}`, {
          description: 'Successful registration',
        })

        if (props.callbackOnSubmit) {
          props.callbackOnSubmit()
        }
      } else {
        throw new Error('User creation failed unexpectedly')
      }
    } catch (err) {
      console.error('Catch :', err)

      toast.error(`Error while creating your account`, {
        description: err instanceof Error ? err.message : JSON.stringify(err),
      })
    }
  }

  return (
    <Form {...form}>
      <form
        aria-label="signup form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl
                  onChange={(e) => {
                    handleChange(e, field.onChange)
                  }}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl
                  onChange={(e) => {
                    handleChange(e, field.onChange)
                  }}
                >
                  <Input
                    placeholder="Enter your username"
                    autoComplete="username"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field: { onChange, ...restField } }) => {
            return (
              <FormItem>
                <FormLabel>
                  Password
                  <PasswordTooltip />
                </FormLabel>
                <PasswordVisibiltyInput
                  onChange={(e) => {
                    handleChange(e, onChange)
                  }}
                  autocomplete="new-password"
                  disabled={isSubmitting}
                  field={restField}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field: { onChange, ...restField } }) => {
            return (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <PasswordVisibiltyInput
                  onChange={(e) => {
                    handleChange(e, onChange)
                  }}
                  autocomplete="new-password"
                  disabled={isSubmitting}
                  field={restField}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <Button
          data-testid="submit-signup"
          id="signup-submit"
          className="w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner show size="small" /> : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm
