import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import PasswordVisibiltyInput from '@/features/auth/components/PasswordVisibiltyInput'
import {
  signInFormSchema,
  SignInFormType,
} from '@/features/auth/schemas/formSchema'
import { LOGIN } from '@/shared/api/login'
import { WHO_AM_I } from '@/shared/api/whoAmI'
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

type SignInFormPropsType = {
  callbackOnSubmit?: () => void
  onSignUp: () => void
}

const SignInForm = (props: SignInFormPropsType) => {
  const [login] = useMutation(LOGIN)

  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onBlur', //  validation strategy before submitting
    reValidateMode: 'onBlur', // validation strategy after submitting
    shouldFocusError: true, // focus first field with an error if the form that fails validation ()
  })

  const hasRootError = !!form.formState.errors.root
  const isSubmitting = form.formState.isSubmitting

  useEffect(() => {
    if (hasRootError) {
      form.setFocus('email', { shouldSelect: true })
    }
  }, [hasRootError, form])

  const handleChange = (
    e: React.FormEvent<HTMLElement>,
    onChange: (...event: unknown[]) => void,
  ) => {
    onChange(e)
    if (e.target instanceof HTMLInputElement) {
      form.clearErrors(e.target.name as keyof SignInFormType)
      form.clearErrors('root')
    }
  }

  const onSubmit = async (values: SignInFormType) => {
    try {
      const { data } = await login({
        variables: {
          data: {
            email: values.email,
            password: values.password,
          },
        },
        refetchQueries: [{ query: WHO_AM_I }],
      })

      if (!data?.login) {
        form.setError('root', {
          type: 'custom',
          message: 'Invalid credentials',
        })
        return
      }

      toast.success('Successful login', {
        description: `👋 Welcome back ${data.login.username ?? 'Codejamer'}`,
      })
      if (props.callbackOnSubmit) {
        form.reset()
        props.callbackOnSubmit()
      }
    } catch (err: unknown) {
      toast.error(`Failed to login`, {
        description: err instanceof Error ? err.message : JSON.stringify(err),
      })
    }
  }

  return (
    <Form {...form}>
      <form
        aria-label="signin form"
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
          name="password"
          render={({ field: { onChange, ...restField } }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <PasswordVisibiltyInput
                  onChange={(e) => {
                    handleChange(e, onChange)
                  }}
                  autocomplete="current-password"
                  disabled={isSubmitting}
                  field={restField}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <Button
          data-testid="submit-signin"
          id="signin-submit"
          className="w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner show size="small" /> : 'Sign In'}
        </Button>

        {form.formState.errors.root && (
          <div className="text-destructive text-center text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
          New user?
          <Button
            variant="link"
            size="sm"
            className="p-1"
            disabled={isSubmitting}
            onClick={props.onSignUp}
          >
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SignInForm
