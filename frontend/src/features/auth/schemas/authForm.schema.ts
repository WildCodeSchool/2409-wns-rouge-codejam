import { z } from 'zod'

export const PASSWORD_REQUIREMENT = {
  minLength: 'Must contain at least 12 characters',
  uppercase: 'Must contain at least an uppercase letter',
  lowercase: 'Must contain at least a lowercase letter',
  number: 'Must contain at least a number',
  special: 'Must contain at least a special character',
}

export const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, 'This field is required')
    .email('Please provide a valid email address (example: name@example.com)'),
  password: z.string().min(1, 'This field is required'),
})

export const signUpFormSchema = signInFormSchema
  .extend({
    username: z.string().superRefine((val, ctx) => {
      if (val.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
        })
      }
      if (val.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: 'string',
          minimum: 2,
          inclusive: true,
          message: 'Username must contain at least 2 characters',
        })
      }
      if (val.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: 'string',
          maximum: 50,
          inclusive: true,
          message: 'Username must contain at most 50 characters',
        })
      }
    }),
    password: z
      .string()
      .min(1, 'This field is required')
      .min(12, PASSWORD_REQUIREMENT.minLength)
      .regex(/[A-Z]/, PASSWORD_REQUIREMENT.uppercase)
      .regex(/[a-z]/, PASSWORD_REQUIREMENT.lowercase)
      .regex(/[0-9]/, PASSWORD_REQUIREMENT.number)
      .regex(/[^A-Za-z0-9]/, PASSWORD_REQUIREMENT.special),
    confirmPassword: z.string().min(1, 'This field is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const snippetEditSchema = z.object({
  name: z.string().min(1, 'This field is required'),
})

export type SignInFormType = z.infer<typeof signInFormSchema>

export type SignUpFormType = z.infer<typeof signUpFormSchema>

export type SnippetEditType = z.infer<typeof snippetEditSchema>
