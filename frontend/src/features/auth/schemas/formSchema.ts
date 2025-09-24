import { z } from 'zod'

export const PASSWORD_REQUIREMENT = {
  minLength: 'Must contain at least 16 character(s)',
  uppercase: 'Must contain at least an uppercase letter',
  lowercase: 'Must contain at least a lowercase letter',
  number: 'Must contain at least a number',
  special: 'Must contain at least a special character',
}

export const signInFormSchema = z.object({
  email: z.string().email('Must be an email'),
  password: z.string().min(1),
})

export const signUpFormSchema = signInFormSchema
  .extend({
    username: z.string().min(2).max(50),
    password: z
      .string()
      .min(16, PASSWORD_REQUIREMENT.minLength)
      .regex(/[A-Z]/, PASSWORD_REQUIREMENT.uppercase)
      .regex(/[a-z]/, PASSWORD_REQUIREMENT.lowercase)
      .regex(/[0-9]/, PASSWORD_REQUIREMENT.number)
      .regex(/[^A-Za-z0-9]/, PASSWORD_REQUIREMENT.special),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// Zod schema for snippet creation
export const snippetCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(
      /^[A-Za-z0-9_\- ]+$/,
      'Only letters, numbers, underscores, spaces, and dashes are allowed',
    ),
  code: z.string().optional(),
  language: z.string().default('typescript'),
})

export type SignInFormType = z.infer<typeof signInFormSchema>

export type SignUpFormType = z.infer<typeof signUpFormSchema>

export type SnippetCreateType = z.infer<typeof snippetCreateSchema>
