import { ValidationError } from 'class-validator'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'
import { User } from '../entities/User'
import axios, { AxiosError } from 'axios'
import {
  CodeExecutionRequest,
  CodeExecutionResponse,
  ContextType,
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

/**
 * Function to create a user with the role guest
 * @returns The created user
 */
export async function createGuestUser(): Promise<User> {
  const newUser = new User()
  const savedUser = await User.save(newUser)
  return savedUser
}

/**
 * Function to lock the given user and so prevent him from executing script
 * @param user - The user to lock
 * @returns The created user
 */
export async function lockUser(user: User): Promise<void> {
  Object.assign(user, { isLocked: true })
  await User.save(user)
}

/**
 * Function to unlock a locked user, so he can execute code again
 * @param user - The user to unlock
 */
export async function unlockUser(user: User): Promise<void> {
  Object.assign(user, { isLocked: false })
  await User.save(user)
}

/**
 * Function to create a snippet
 * @param data - The data with the code, name & language.
 * @param user - The user to associate with the snippet
 * @returns The created snippet
 */
export async function createSnippet(
  data: SnippetCreateInput,
  user: User,
): Promise<Snippet> {
  const newSnippet = new Snippet()
  Object.assign(newSnippet, data, { user })
  return await Snippet.save(newSnippet)
}

/**
 * Function to update a snippet
 * @param snippet - The snippet to update
 * @param data - The data to update in the snippet
 * @returns The updated snippet
 */
export async function updateSnippet(
  snippet: Snippet,
  data: SnippetUpdateInput,
): Promise<Snippet> {
  Object.assign(snippet, data)
  return await Snippet.save(snippet)
}

/**
 * Function to get a specific snippet of a user
 * @param snippetId - The id of the snippet
 * @param userId - The user id
 * @returns A snippet if present, otherwise null
 */
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

/**
 * Function to get the first snippet of a user
 * @param userId - The user id
 * @returns A snippet if present, otherwise null
 */
export async function getFirstSnippet(userId: string): Promise<Snippet | null> {
  return Snippet.findOne({
    where: {
      user: {
        id: userId,
      },
    },
  })
}

/**
 * Function to get the count of executions made by a user within the last given hours.
 * @param userId - The user id
 * @param timeLimit - The time limit in hours
 * @returns The number of executions
 */
export async function getUserExecutionCount(
  userId: string,
  timeLimit = 24,
): Promise<number> {
  const dateTime = new Date(Date.now() - timeLimit * 60 * 60 * 1000)
  const executions = await Execution.find({
    where: {
      snippet: {
        user: {
          id: userId,
        },
      },
      executedAt: MoreThan(dateTime),
    },
  })
  return executions.length
}

/**
 * Function to generate a cookie with a jwt.
 * @param userId - The user id
 * @param context - The context of the request
 */
export function createCookieWithJwt(userId: string, context: ContextType) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || '', {
    expiresIn: '24h',
  })
  new Cookies(context.req, context.res).set('access_token', token, {
    httpOnly: true,
    secure: false,
  })
}

/**
 * Function to send a code to be executed by code-execution service.
 * @param req - An object with the code and a language
 * @returns The execution response as an object with the status and the result
 */
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

function isCodeExecutionResponse(res: unknown): res is CodeExecutionResponse {
  return (
    typeof res === 'object' &&
    res !== null &&
    'status' in res &&
    'result' in res
  )
}
