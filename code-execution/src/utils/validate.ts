import chalk from 'chalk'
import { ZodError, ZodSchema } from 'zod'

export function validateData(schema: ZodSchema) {
  return (req: any, res: any, next: any) => {
    try {
      console.log(chalk.yellow('Validating request data...'))
      schema.parse(req.body)
      console.log(chalk.green('✅Request data OK!'))
      next()
    } catch (error: unknown) {
      console.log(chalk.red('❌Invalid request data!'))
      if (error instanceof ZodError) {
        console.log(chalk.red('❌Invalid request data!', error))
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
