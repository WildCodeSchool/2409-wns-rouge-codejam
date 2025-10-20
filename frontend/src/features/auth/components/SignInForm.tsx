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
          name="password"
          render={({ field: { onChange, ...restField } }) => {
            return (
              <FormItem>
                <FormLabel>
                  Password<span className="text-destructive-foreground">*</span>
                </FormLabel>
                <PasswordVisibiltyInput
                  required
                  autoComplete="current-password"
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
        <Button
          type="submit"
          data-testid="submit-signin"
          id="signin-submit"
          disabled={isSubmitting}
          className="mb-0 w-full"
        >
          {isSubmitting ? <Spinner show size="small" /> : 'Sign In'}
        </Button>

        {form.formState.errors.root && (
          <div className="text-destructive mt-6 text-center text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
      </form>

      <div className="text-muted-foreground mt-4 mb-2 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span>New user?</span>
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
    </Form>
  )
}
