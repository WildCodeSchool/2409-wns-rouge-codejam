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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import PasswordVisibiltyFormField from '../ui/PasswordVisibiltyButton'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '@/shared/api/createUser'
import { toast } from 'sonner'

const formSchema = z
  .object({
    email: z.string().email('must be an email.'),
    username: z.string().min(2).max(50),
    password: z
      .string()
      .min(16)
      .regex(/[A-Z]/, 'Must contain at least an uppercase letter')
      .regex(/[a-z]/, 'Must contain at least an lowercase letter')
      .regex(/[0-9]/, 'Must contain at least a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignUpFormPropsType = {
  callbackOnSubmit: () => void
}

const SignUpForm = (props: SignUpFormPropsType) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [createUser] = useMutation(CREATE_USER)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
    shouldUnregister: true,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { errors, data } = await createUser({
      variables: {
        data: {
          username: values.username,
          email: values.email,
          password: values.password,
        },
      },
    })

    if (errors) {
      for (const error of errors) {
        toast.error(`Error while creating your account: ${error.message}`)
      }
    }

    if (data?.createUser) {
      toast.success(`Welcome ${data.createUser.username ?? 'Codejamer'}`, {
        description: 'Successful registration',
      })
      props.callbackOnSubmit()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PasswordVisibiltyFormField
          name="Password"
          formName="password"
          formControl={form.control}
          isVisible={showPassword}
          setIsVisible={(isVisible) => {
            setShowPassword(isVisible)
          }}
        />
        <PasswordVisibiltyFormField
          name="Confirm password"
          formName="confirmPassword"
          formControl={form.control}
          isVisible={showConfirmPassword}
          setIsVisible={(isVisible) => {
            setShowConfirmPassword(isVisible)
          }}
        />
        <Button className="w-full" type="submit">
          Sign up
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
