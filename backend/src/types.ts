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

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
