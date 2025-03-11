import { AuthChecker } from 'type-graphql'
import { User } from '../entities/user'
import { getUserFromContext } from '../resolvers/utils'

export type ContextType = {
  req: any
  res: any
  user?: User
}

export type AuthContextType = ContextType & {
  user: User
}

export const customAuthChecker: AuthChecker<ContextType> = async ({
  context,
}) => {
  const user = await getUserFromContext(context)
  if (!user) return false

  context.user = user
  return true
}
