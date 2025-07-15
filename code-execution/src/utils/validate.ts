import chalk from 'chalk'
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ExecuteSchema } from '../schema/executeSchema'

export function validateData(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = ExecuteSchema
    console.log(chalk.yellow('Validating request data...'))
    schema.parse(req.body)
    console.log(chalk.green('✅Request data OK!'))
    next()
  } catch (error: unknown) {
    console.log(chalk.red('❌Invalid request data!'))
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
