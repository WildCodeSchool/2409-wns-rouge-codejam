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
import { MoreThan, Not } from 'typeorm'
import {
  Snippet,
  SnippetCreateInput,
  SnippetUpdateInput,
} from '../entities/Snippet'
import { GraphQLError } from 'graphql'
import { UserSubscription } from '../entities/UserSubscription'
import { Plan } from '../entities/Plan'

/**
 * Retrieve current user from context (if authenticated).
 * @param context - The context object that contains the request and response objects.
 * @returns The user object if found (authenticated user), otherwise null
 * @throws An error if the jwt is invalid
 */
export async function getUserFromContext(
  context: ContextType,
): Promise<User | null> {
  if (context.user) return context.user

  const cookies = new Cookies(context.req, context.res)
  const cookieValue = cookies.get('access_token')
  if (!cookieValue) return null

  try {
    const jwtToken = jwt.verify(
      cookieValue,
      process.env.JWT_SECRET || '',
    ) as UserIDJwtPayload

    const user = await User.findOne({ where: { id: jwtToken.userId } })
    return user
  } catch (e: unknown) {
    // Delete the cookie
    cookies.set('access_token', '', { maxAge: 0 })

    throw new GraphQLError('Session expired. Please log in again.', {
      extensions: { code: 'INVALID_JWT' },
    })
  }
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
 * @param timeLimitInHours - The time limit in hours
 * @returns The number of executions
 */
export async function getUserExecutionCount(
  userId: string,
  timeLimitInHours = 24,
): Promise<number> {
  const dateTime = new Date(Date.now() - timeLimitInHours * 60 * 60 * 1000)
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
 * Function to get the count of snippets own by a user.
 * @param userId - The user id
 * @returns The number of snippets
 */
export async function getUserSnippetCount(userId: string): Promise<number> {
  const snippets = await Snippet.find({
    where: {
      user: {
        id: userId,
      },
    },
  })
  return snippets.length
}

/**
 * Function to generate a cookie with a jwt.
 * @param userId - The user id
 * @param context - The context of the request
 */
export function createCookieWithJwt(
  userId: string,
  context: ContextType,
  expiresIn: number | null = 24 * 60 * 60,
) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || '', {
    // If expiresIn is explicitly set to null, we omit the parameter. This makes the JWT imperishable.
    ...(expiresIn !== null && { expiresIn }),
  })

  new Cookies(context.req, context.res, {
    secure: process.env.NODE_ENV === 'production', // 👈 explicitally specify the connection as secure, rather than this module examining request (ensure sending cookies from "unsecured" (HTTP) intra server)
  }).set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

/**
 * Function to delete a cookie.
 * @param userId - The user id
 * @param context - The context of the request
 */
export function deleteCookie(context: ContextType) {
  const cookies = new Cookies(context.req, context.res)
  cookies.set('access_token', '', { maxAge: 0 })
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

export async function findActiveSubscription(
  targetUserId: string,
): Promise<UserSubscription | null> {
  // can be null if premium subscription is expired and user hasn't logged in since its expiration

  let activeSubscription = await UserSubscription.findOne({
    where: {
      user: { id: targetUserId },
    },
    relations: ['plan', 'user'],
    order: { subscribedAt: 'DESC' },
  })

  if (activeSubscription?.expiresAt) {
    const isExpired = activeSubscription.expiresAt < new Date()

    if (isExpired) {
      return null
    }
    return activeSubscription
  }

  return activeSubscription
}

export async function createDefaultSubscription(user: User): Promise<Boolean> {
  const defaultPlan = await Plan.findOne({
    where: { name: Not('guest'), price: 0 },
  })

  if (defaultPlan) {
    const newUserSubscription = new UserSubscription()
    Object.assign(newUserSubscription, {
      user: user,
      plan: defaultPlan,
    })
    await newUserSubscription.save()
    return true
  }
  return false
}

export async function subscribeGuest(
  userId: string,
): Promise<UserSubscription> {
  const [user, guestPlan] = await Promise.all([
    User.findOne({ where: { id: userId } }),
    Plan.findOne({ where: { name: 'guest' } }),
  ])

  if (!guestPlan) {
    throw new Error('Guest plan not found')
  }

  if (!user) {
    throw new Error('User not found')
  }

  const newUserSubscription = new UserSubscription()
  Object.assign(newUserSubscription, {
    user: user,
    plan: guestPlan,
    subscribedAt: new Date(),
  })
  return await UserSubscription.save(newUserSubscription)
}
