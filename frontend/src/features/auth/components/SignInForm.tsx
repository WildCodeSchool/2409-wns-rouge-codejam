import PasswordVisibiltyInput from '@/features/auth/components/PasswordVisibiltyInput'
import { useSignInForm } from '@/features/auth/hooks'
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

export default function SignInForm({
  callbackOnSubmit,
  onSignUp,
}: SignInFormPropsType) {
  const { form, handleChange, isSubmitting, submitForm } =
    useSignInForm(callbackOnSubmit)

  return (
    <Form {...form}>
      <form
        data-testid="signin-form"
        aria-label="signin form"
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
                  autoComplete="current-password"
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
            onClick={onSignUp}
          >
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  )
}
