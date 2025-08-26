import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  signUpFormSchema,
  SignUpFormType,
} from '@/features/auth/schemas/formSchema'
import { CREATE_USER } from '@/shared/api/createUser'
import { WHO_AM_I } from '@/shared/api/whoAmI'

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
    mode: 'onTouched', // 	validation strategy before submitting (validate only after user interacted once with the input)
    reValidateMode: 'onChange', // after touched, re-validate as user types
    shouldFocusError: true, // focus first invalid field on submit
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
          toast.success(`Welcome ${data.createUser.username ?? 'Codejamer'}`, {
            description: 'Successful registration',
          })

          cbFn?.()
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
            description:
              err instanceof Error ? err.message : JSON.stringify(err),
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
