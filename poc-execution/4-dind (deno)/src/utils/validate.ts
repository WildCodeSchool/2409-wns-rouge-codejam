import { ZodError, ZodSchema } from 'zod'

export function validateData(schema: ZodSchema) {
  return (req: any, res: any, next: any) => {
    try {
      console.log('Validating request data...')
      schema.parse(req.body)
      console.log('✅Request data OK!')
      next()
    } catch (error: unknown) {
      console.log('❌Invalid request data!')
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Invalid request body',
          errors: error.flatten().fieldErrors,
        })
      }
      return res.status(400).json({
        message: 'Invalid request body',
      })
    }
  }
}
