import { z } from 'zod'
import { Language } from '../types'

export const ExecuteSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  language: z.nativeEnum(Language),
})
