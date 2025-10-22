import jwt from 'jsonwebtoken'
import { IncomingMessage, ServerResponse } from 'node:http'
import { User } from './entities/User'

// Restrict the `user` type to `User` (no `null` nor `undefined` values) to be used with resources protected by the `@Authorized` decorator (check already performed by the `customAuthChecker` function).
export type AuthContextType = ContextType & {
  user: User
}

export type ContextType = {
  req: IncomingMessage
  res: ServerResponse
  // null -> user either not authenticated or either not authorized
  // undefined -> user not checked yet
  // User -> user both authenticated and authorized
  user: Nullable<User>
}

// Generic type to allow nullable values
export type Nullable<T> = T | null | undefined

export type UserIDJwtPayload = jwt.JwtPayload & {
  userId: string
}

export type CodeExecutionResponse = {
  status: ExecutionStatus
  result: string
}

export type CodeExecutionRequest = {
  code: string
  language: Language
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export enum ExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  TIMEOUT = 'timeout',
}

export enum Language {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
}

export enum CancellationReason {
  EXPIRED = 'expired',
  SUBSCRIBED = 'subscribed to premium',
  CANCELLED = 'cancelled by user',
  CANCELEDADMIN = 'canceled by admin',
  UNPAID = 'unpaid',
}
