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
import {
  signUpFormSchema,
  SignUpFormType,
} from '@/features/auth/schemas/formSchema'

type SignUpFormPropsType = {
  onSignIn: () => void
  callbackOnSubmit?: () => void
}

const SignUpForm = (props: SignUpFormPropsType) => {
  const [createUser] = useMutation(CREATE_USER)

  const form = useForm<SignUpFormType>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    }, // required for controlled inputs
    resolver: zodResolver(signUpFormSchema),
    mode: 'onBlur', // 	validation strategy before submitting
    reValidateMode: 'onBlur', // validation strategy after submitting
    shouldFocusError: true, // focus first field with an error if the form that fails validation ()
  })

  const isSubmitting = form.formState.isSubmitting
  const isSubmittingError = Object.keys(form.formState.errors)

  const handleChange = (
    e: React.FormEvent<HTMLElement>,
    onChange: (...event: unknown[]) => void,
  ) => {
    onChange(e)
    if (e.target instanceof HTMLInputElement) {
      form.clearErrors(e.target.name as keyof SignUpFormType)
    }
  }

  const onSubmit = async (values: SignUpFormType) => {
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
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('email')) {
          form.setError('email', {
            message: 'This email already exists',
          })
        }
        if (err.message.includes('username')) {
          form.setError('username', {
            message: 'This username already exists',
          })
        }
      } else {
        toast.error(`Error while creating your account`, {
          description: err instanceof Error ? err.message : JSON.stringify(err),
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form
        data-testid="signup-form"
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
                    data-testid="email-input"
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
                    data-testid="username-input"
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
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  field={restField}
                  data-testid="password-input"
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
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  data-testid="confirm-password-input"
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
          disabled={isSubmitting || isSubmittingError.length > 0}
        >
          {isSubmitting ? <Spinner show size="small" /> : 'Sign Up'}
        </Button>
      </form>

      <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
        Already have an account?
        <Button
          variant="link"
          size="sm"
          className="p-1"
          disabled={isSubmitting}
          onClick={props.onSignIn}
        >
          Sign In
        </Button>
      </div>
    </Form>
  )
}

export default SignUpForm
