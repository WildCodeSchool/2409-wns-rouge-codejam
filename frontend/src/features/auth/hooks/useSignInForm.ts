import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { signInFormSchema, SignInFormType } from '@/features/auth/schemas'

import { LOGIN } from '@/shared/api/login'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { TOAST_OPTIONS } from '@/shared/config'

export default function useSignInForm(cbFn?: () => void) {
  const [loginMutation] = useMutation(LOGIN)

  const form = useForm<SignInFormType>({
    defaultValues: {
      email: '',
      password: '',
    }, // required for controlled inputs
    resolver: zodResolver(signInFormSchema),
    mode: 'onChange', // 	validation strategy before submitting (validate only after user interacted once with the input)
    reValidateMode: 'onChange', // after touched, re-validate as user types
    shouldFocusError: true, // focus first invalid field on submit
    delayError: 2000, // wait after user stops typing to show error
  })

  const isSubmitting = form.formState.isSubmitting
  const hasRootError = !!form.formState.errors.root

  useEffect(() => {
    if (hasRootError) {
      form.setFocus('email', { shouldSelect: true })
    }
  }, [hasRootError, form])

  const handleChange = useCallback(
    (
      e: React.FormEvent<HTMLElement>,
      onChange: (...event: unknown[]) => void,
    ) => {
      onChange(e)
      if (e.target instanceof HTMLInputElement) {
        form.clearErrors(e.target.name as keyof SignInFormType)
        form.clearErrors('root')
      }
    },
    [form],
  )
  const submitForm = useCallback(
    async (values: SignInFormType) => {
      try {
        const { data } = await loginMutation({
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
          ...TOAST_OPTIONS.success,
          description: `Welcome back ${data.login.username ?? 'Codejamer'} 👋`,
        })

        if (cbFn) {
          form.reset()
          cbFn()
        }
      } catch (_err: unknown) {
        toast.error("Oops! We couldn't log you in...", {
          ...TOAST_OPTIONS.error,
        })
      }
    },
    [loginMutation, form, cbFn],
  )

  return { form, handleChange, isSubmitting, submitForm }
}
