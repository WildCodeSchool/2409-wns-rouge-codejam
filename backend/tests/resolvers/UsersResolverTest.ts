import { describe, expect, it } from '@jest/globals'
import { CREATE_USER } from '../api/users'
import { TestArgs } from '../index.spec'
import { User, UserCreateInput } from '../../src/entities/user'
import { assert } from '../utils/assert'

type CreateUserMation = {
  createUser: User
}

export async function UsersResolverTest(testArgs: TestArgs) {
  describe('createUser', () => {
    const validUserInfo: UserCreateInput = {
      username: 'john doe',
      email: 'john-doe@email.com',
      password: 'Super-John-Doe-123',
    }

    it('should fail if invalid username', async () => {
      if (!testArgs.server) {
        throw new Error('Test server is not initialized')
      }
      const invalidUserInfo = { ...validUserInfo, username: 'j' }
      const response = await testArgs.server.executeOperation({
        query: CREATE_USER,
        variables: { data: invalidUserInfo },
      })
      // Check API response.
      assert(response.body.kind === 'single')
      const { errors } = response.body.singleResult

      assert(errors !== undefined)
      const validationErrors: Array<unknown> = errors[0].extensions
        ?.validationErrors as any as unknown[]
      expect(errors).toBeDefined()
      expect(errors[0].extensions).toMatchObject({ code: 'BAD_USER_INPUT' })
      expect(validationErrors[0]).toMatchObject({
        property: 'username',
      })
    })

    it('should fail if invalid email', async () => {
      if (!testArgs.server) {
        throw new Error('Test server is not initialized')
      }
      const invalidUserInfo = { ...validUserInfo, email: 'john' }
      const response = await testArgs.server.executeOperation({
        query: CREATE_USER,
        variables: { data: invalidUserInfo },
      })
      // Check API response.
      assert(response.body.kind === 'single')
      const { errors } = response.body.singleResult

      assert(errors !== undefined)
      const validationErrors: Array<unknown> = errors[0].extensions
        ?.validationErrors as any as unknown[]
      expect(errors).toBeDefined()
      expect(errors[0].extensions).toMatchObject({ code: 'BAD_USER_INPUT' })
      expect(validationErrors[0]).toMatchObject({
        property: 'email',
      })
    })

    it('should fail if invalid password', async () => {
      if (!testArgs.server) {
        throw new Error('Test server is not initialized')
      }
      const invalidUserInfo = { ...validUserInfo, password: 'secret' }
      const response = await testArgs.server.executeOperation({
        query: CREATE_USER,
        variables: { data: invalidUserInfo },
      })
      // Check API response.
      assert(response.body.kind === 'single')
      const { errors } = response.body.singleResult

      assert(errors !== undefined)
      const validationErrors: Array<unknown> = errors[0].extensions
        ?.validationErrors as any as unknown[]
      expect(errors).toBeDefined()
      expect(errors[0].extensions).toMatchObject({ code: 'BAD_USER_INPUT' })
      expect(validationErrors[0]).toMatchObject({
        property: 'password',
      })
    })

    it('should succeed if valid user info', async () => {
      if (!testArgs.server) {
        throw new Error('Test server is not initialized')
      }
      const response = await testArgs.server.executeOperation({
        query: CREATE_USER,
        variables: { data: validUserInfo },
      })
      // Check API response.
      assert(response.body.kind === 'single')
      const { data, errors } = response.body.singleResult
      expect(errors).toBeUndefined()
      expect(data).toBeDefined()
      assert(data !== undefined && data !== null)
      assert(data.createUser !== undefined && data !== null)
      const userId = (data as CreateUserMation).createUser?.id
      expect(userId).toBeDefined()

      // Check user is created in DB.
      const userInDB = await User.findOneBy({
        id: userId,
      })
      expect(userInDB).toBeDefined()
      assert(userInDB !== null)
      expect(userInDB?.email).toBe(validUserInfo.email)
      expect(userInDB?.hashedPassword).not.toBe(validUserInfo.password)

      // Store user ID for later tests.
      testArgs.data.user = userInDB.id
    })
  })
}
