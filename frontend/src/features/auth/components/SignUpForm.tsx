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
        className="space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Email<span className="text-destructive-foreground">*</span>
                </FormLabel>
                <FormControl
                  onChange={(e) => {
                    handleChange(e, field.onChange)
                  }}
                >
                  <Input
                    required
                    data-testid="email-input"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage role="alert" />
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
                <FormLabel>
                  Username<span className="text-destructive-foreground">*</span>
                </FormLabel>
                <FormControl
                  onChange={(e) => {
                    handleChange(e, field.onChange)
                  }}
                >
                  <Input
                    required
                    data-testid="username-input"
                    autoComplete="username"
                    placeholder="Enter your username"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage role="alert" />
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
                  Password<span className="text-destructive-foreground">*</span>
                  <PasswordTooltip />
                </FormLabel>
                <PasswordVisibiltyInput
                  required
                  data-testid="password-input"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  field={restField}
                  onChange={(e) => {
                    handleChange(e, onChange)
                  }}
                />
                <FormMessage role="alert" />
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
                <FormLabel>
                  Confirm password
                  <span className="text-destructive-foreground">*</span>
                </FormLabel>
                <PasswordVisibiltyInput
                  required
                  data-testid="confirm-password-input"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  field={restField}
                  onChange={(e) => {
                    handleChange(e, onChange)
                  }}
                />
                <FormMessage role="alert" />
              </FormItem>
            )
          }}
        />
        <Button
          id="signup-submit"
          data-testid="submit-signup"
          className="w-full"
          type="submit"
          disabled={isSubmitting || isSubmittingError.length > 0}
        >
          {isSubmitting ? <Spinner show size="small" /> : 'Sign Up'}
        </Button>
      </form>

      <div className="text-muted-foreground mt-4 mb-2 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span>Already have an account?</span>
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
