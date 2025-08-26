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
import { useSignUpForm } from '@/features/auth/hooks'

type SignUpFormPropsType = {
  callbackOnSubmit?: () => void
  onSignIn: () => void
}

export default function SignUpForm({
  callbackOnSubmit,
  onSignIn,
}: SignUpFormPropsType) {
  const { form, handleChange, isSubmitting, isSubmittingError, submitForm } =
    useSignUpForm(callbackOnSubmit)

  return (
    <Form {...form}>
      <form
        data-testid="signup-form"
        aria-label="signup form"
        onSubmit={form.handleSubmit(submitForm)}
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
                    autoFocus
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
          onClick={onSignIn}
        >
          Sign In
        </Button>
      </div>
    </Form>
  )
}
