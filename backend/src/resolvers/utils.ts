import { ValidationError } from 'class-validator'
import jwt from 'jsonwebtoken'
import { ContextType } from '../auth/custom-auth-checker'
import Cookies from 'cookies'
import { User } from '../entities/user'
import axios, { AxiosError } from 'axios'
import { CodeExecutionRequest, CodeExecutionResponse } from './types'

export const validationError = (errors: ValidationError[]): Error => {
  return new Error(
    `validation errors : ${errors.map((error) => {
      const property = error.property
      const constraintsKeys =
        error.constraints && Object.keys(error.constraints)
      const constraintsValues =
        error.constraints && Object.values(error.constraints)

      let constraints

      if (constraintsKeys && constraintsValues)
        constraints = constraintsKeys.map(
          (constraintsKeys, index) =>
            `${constraintsKeys} : ${constraintsValues[index]}`,
        )
      return `${property} : ${constraints}`
    })}`,
  )
}

export function getUserIdFromToken(token: string): number {
  const payload: any = jwt.verify(token, process.env.JWT_SECRET || '')
  return payload.userId
}

export async function getUserFromContext(
  context: ContextType,
): Promise<User | null> {
  if (context.user) return context.user

  const cookies = new Cookies(context.req, context.res)
  const token = cookies.get('access_token')
  if (!token) return null

  const userId = getUserIdFromToken(token)

  const user = await User.findOne({ where: { id: userId } })
  if (!user) return null

  return user
}

function isCodeExecutionResponse(res: unknown): res is CodeExecutionResponse {
  return (
    typeof res === 'object' &&
    res !== null &&
    'status' in res &&
    'result' in res
  )
}

export async function sendCodeToExecute(
  req: CodeExecutionRequest,
): Promise<CodeExecutionResponse> {
  try {
    const res = await axios.post(
      `${process.env.CODE_EXECUTION_URL}/execute`,
      req,
    )

    if (!isCodeExecutionResponse(res.data)) {
      throw new Error(
        `Unexpected Response from code-execution service: ${JSON.stringify(res.data)}`,
      )
    }

    return res.data
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data) {
      throw new Error(
        `Error from code-execution service: ${err.response.data.message} ${JSON.stringify(err.response.data.errors)}`,
      )
    } else {
      throw new Error(
        `Error from code-execution service: ${JSON.stringify(err)}`,
      )
    }
  }
}
