import { MiddlewareFn } from 'type-graphql'
import { User } from '../entities/User'
import { AuthContextType, UserRole } from '../types'
import { getUserFromContext } from '../resolvers/utils'

/**
 * Restrict access to a field entity depending on user and role.
 * @param next the entity field or a masked string
 */
export const IsUser: MiddlewareFn<AuthContextType> = async (
  { context, root },
  next: () => Promise<User['email']>,
) => {
  const user = await getUserFromContext(context)
  if (user) {
    // `root` refers the object (resource) being resolved.
    const hasAccess =
      user.id === (root as User).id || user.role === UserRole.ADMIN
    if (hasAccess) {
      // Return the field content since the user is allowed to access the field.
      return next()
    }
  }
  // Mask the field content since the user is not allowed to access the field.
  return '******'
}
