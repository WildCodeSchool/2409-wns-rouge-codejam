import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { signUpFormSchema, SignUpFormType } from '@/features/auth/schemas'

import { CREATE_USER } from '@/shared/api/createUser'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { TOAST_OPTIONS } from '@/shared/config'

export default function useSignInForm(cbFn?: () => void) {
  const [createUserMutation] = useMutation(CREATE_USER)

  const form = useForm<SignUpFormType>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    }, // required for controlled inputs
    resolver: zodResolver(signUpFormSchema),
    mode: 'onChange', // 	validation strategy before submitting (validate only after user interacted once with the input)
    reValidateMode: 'onChange', // after touched, re-validate as user types
    shouldFocusError: true, // focus first invalid field on submit
    delayError: 2000, // wait after user stops typing to show error
  })

  const isSubmitting = form.formState.isSubmitting
  const isSubmittingError = Object.keys(form.formState.errors)

  const handleChange = useCallback(
    (
      e: React.FormEvent<HTMLElement>,
      onChange: (...event: unknown[]) => void,
    ) => {
      onChange(e)
      if (e.target instanceof HTMLInputElement) {
        form.clearErrors(e.target.name as keyof SignUpFormType)
      }
    },
    [form],
  )

  const submitForm = useCallback(
    async (values: SignUpFormType) => {
      try {
        const { data } = await createUserMutation({
          variables: {
            data: {
              username: values.username,
              email: values.email,
              password: values.password,
            },
          },
          refetchQueries: [{ query: WHO_AM_I }],
        })

        if (data?.createUser) {
          toast.success('Successful registration', {
            ...TOAST_OPTIONS.success,
            description: `Welcome ${data.createUser.username ?? 'Codejamer'} 🎉 `,
          })

          cbFn?.()
        }
      } catch (err: unknown) {
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
          console.error(err)
          toast.error("Oops! We couldn't create your account...", {
            ...TOAST_OPTIONS.error,
          })
        }
      }
    },
    [createUserMutation, form, cbFn],
  )

  return {
    form,
    handleChange,
    isSubmitting,
    isSubmittingError,
    submitForm,
  }
}
