import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
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
import PasswordVisibiltyInput from '@/shared/components/PasswordVisibiltyInput'

const formSchema = z
  .object({
    email: z.string().email('Must be an email'),
    username: z.string().min(2).max(50),
    password: z
      .string()
      .min(16, 'Must contain at least 16 character(s)')
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

export type SignUpFormType = z.infer<typeof formSchema>

type SignUpFormPropsType = {
  callbackOnSubmit?: () => void
}

const SignUpForm = (props: SignUpFormPropsType) => {
  const [createUser] = useMutation(CREATE_USER)

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur', // 	validation strategy before submitting
    reValidateMode: 'onBlur', // validation strategy after submitting
    shouldFocusError: true, // focus first field with an error if the form that fails validation ()
  })

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
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <PasswordVisibiltyInput field={field} />
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <PasswordVisibiltyInput {...field} />
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
        >
          Sign Up
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
