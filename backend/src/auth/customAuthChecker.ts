import { AuthChecker } from 'type-graphql'
import { getUserFromContext } from '../resolvers/utils'
import { ContextType, UserRole } from '../types'

/**
 * Authorization checker function (similar to a middleware).
 * 
 * The order of execution for the GraphQL standalone server is as follows:
    1. The `context` function is called for each request.
    
  Next step(s) will depend whether the requested resource is protected or not:
 
  For "public" resources (without the `@Authorized` decorator):
    2. The related `resolver` function is called directly for each request. The `authChecker` function is not called!
 
  For "private" resources (with the `@Authorized` decorator):
    2. The `authChecker` function is called for each request and determine whether the user is allowed (has permission, is authorized) to access the protected resource. If the user is not allowed, the request is rejected and the "resolver" function is not called. If the user is authorized, the request proceeds to the next step.

    3. Finally, the "resolver" function related to the requested resource is called for each request:
      public -> all the time
      private -> only if the user has access
 *
 * @param param0 - The context object containing the request and response objects, and the user (if authenticated)
 * @param roles  - The roles required to access the resource. If no roles are specified, the ressource is considered protected and the user must have the `admin` role to access it.
 * @returns
 */
export const customAuthChecker: AuthChecker<ContextType> = async (
  { context },
  roles,
): Promise<boolean> => {
  // Least privileged approach: if not roles are provided within the `@Authorized` decorator of a protected route, the user must have the `admin` role to access the resource.
  if (!roles.length) {
    roles.push(UserRole.ADMIN)
  }

  const user = await getUserFromContext(context)

  // User is not authenticated or not authorized to access the requested resource.
  if (!user || !roles.includes(user.role)) {
    return false
  }

  // Add user to the context object to share data between resolvers.
  context.user = user

  // Proceed to resolver's function since user is both authenticated and authorized
  return true
}
