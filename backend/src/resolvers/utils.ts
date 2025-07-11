import { ValidationError } from 'class-validator'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'
import { User } from '../entities/User'
import axios, { AxiosError } from 'axios'
import {
  CodeExecutionRequest,
  CodeExecutionResponse,
  ContextType,
  Language,
  UserIDJwtPayload,
} from '../types'
import { Execution } from '../entities/Execution'
import { MoreThan } from 'typeorm'
import {
  Snippet,
  SnippetCreateInput,
  SnippetUpdateInput,
} from '../entities/Snippet'

/**
 * Extracts the user ID from a JWT token.
 * @param token - The JWT token from which to extract the user ID.
 * @throws Will throw an error if the token is invalid or expired.
 * @returns The user ID extracted from the token.
 */
export function getUserIdFromToken(token: string): string {
  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET || '',
  ) as UserIDJwtPayload
  return payload.userId
}

/**
 * Retrieve current user from context (if authenticated).
 * @param context - The context object that contains the request and response objects.
 * @returns The user object if found (authenticated user), otherwise null.
 *
 */
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

/**
 * Function to format validation errors into a single error message
 * @param errors - An array of validation errors
 * @returns A formatted error message containing all validation errors
 */
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

export async function createGuestUser(): Promise<User> {
  const newUser = new User()
  const savedUser = await User.save(newUser)
  return savedUser
}

export async function lockUser(user: User): Promise<void> {
  Object.assign(user, { isLocked: true })
  await User.save(user)
}

export async function unlockUser(user: User): Promise<void> {
  Object.assign(user, { isLocked: false })
  await User.save(user)
}

export async function createSnippet(
  snippet: SnippetCreateInput,
  user: User,
): Promise<Snippet> {
  const newSnippet = new Snippet()
  Object.assign(newSnippet, snippet, { user })
  return await Snippet.save(newSnippet)
}

export async function updateSnippet(
  snippet: Snippet,
  updatedContent: SnippetUpdateInput,
): Promise<Snippet> {
  Object.assign(snippet, updatedContent)
  return await Snippet.save(snippet)
}

export async function getSnippet(
  snippetId: string,
  userId: string,
): Promise<Snippet | null> {
  return Snippet.findOne({
    where: {
      id: snippetId,
      user: {
        id: userId,
      },
    },
  })
}

export async function getFirstSnippet(userId: string): Promise<Snippet | null> {
  return Snippet.findOne({
    where: {
      user: {
        id: userId,
      },
    },
  })
}

export async function getUserExecutionCount(userId: string): Promise<number> {
  const dateLimit = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const executions = await Execution.find({
    where: {
      snippet: {
        user: {
          id: userId,
        },
      },
      executedAt: MoreThan(dateLimit),
    },
  })

  console.log('EXECUTIONS       :', executions)

  return executions.length
}

export function createCookieWithJwt(userId: string, context: ContextType) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || '', {
    expiresIn: '24h',
  })
  new Cookies(context.req, context.res).set('access_token', token, {
    httpOnly: true,
    secure: false,
  })
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
