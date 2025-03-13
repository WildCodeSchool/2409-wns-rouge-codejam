import { describe, expect, it } from '@jest/globals'
import { CREATE_USER, LOGIN } from '../api/users'
import { TestArgs } from '../index.spec'
import { User, UserCreateInput } from '../../src/entities/user'
import { assert } from '../utils/assert'

type CreateUserMutation = {
  createUser: User
}

type LoginUserMutation = {
  login: User | null
}

const validUserInfo: UserCreateInput = {
  username: 'john doe',
  email: 'john-doe@email.com',
  password: 'Super-John-Doe-123',
}

export async function UsersResolverTest(testArgs: TestArgs) {
  describe('createUser', () => {
    it('should fail if invalid username', async () => {
      if (!testArgs.server) {
        throw new Error('Test server is not initialized')
      }
      const invalidUserInfo = { ...validUserInfo, username: 'j' }
      const response =
        await testArgs.server.executeOperation<CreateUserMutation>({
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
      const response =
        await testArgs.server.executeOperation<CreateUserMutation>({
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
      const response =
        await testArgs.server.executeOperation<CreateUserMutation>({
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
      const response =
        await testArgs.server.executeOperation<CreateUserMutation>({
          query: CREATE_USER,
          variables: { data: validUserInfo },
        })
      // Check API response.
      assert(response.body.kind === 'single')
      const { data, errors } = response.body.singleResult
      expect(errors).toBeUndefined()
      expect(data).toBeDefined()
      assert(data !== undefined && data !== null)
      const userId = data.createUser.id
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
      testArgs.data.userId = userInDB.id
    })
  })
  describe('login', () => {
    it('should fail if invalid email', async () => {
      if (!testArgs.server) {
        throw new Error('Test server is not initialized')
      }
      const invalidUserInfo = {
        email: 'john',
        password: validUserInfo.password,
      }
      const response =
        await testArgs.server.executeOperation<CreateUserMutation>({
          query: LOGIN,
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
      const invalidUserInfo = { email: validUserInfo.email, password: 'secret' }
      const response =
        await testArgs.server.executeOperation<LoginUserMutation>({
          query: LOGIN,
          variables: { data: invalidUserInfo },
        })
      // Check API response.
      assert(response.body.kind === 'single')
      const { data, errors } = response.body.singleResult
      expect(errors).toBeUndefined()
      assert(data !== undefined && data !== null)
      expect(data.login).toBeNull()
    })

    it('should fail if not existing user', async () => {
      if (!testArgs.server) {
        throw new Error('Test server is not initialized')
      }
      const invalidUserInfo = {
        email: '123' + validUserInfo.email,
        password: validUserInfo.password,
      }
      const response =
        await testArgs.server.executeOperation<LoginUserMutation>({
          query: LOGIN,
          variables: { data: invalidUserInfo },
        })

      // Check API response.
      assert(response.body.kind === 'single')
      const { data, errors } = response.body.singleResult
      expect(errors).toBeUndefined()
      assert(data !== undefined && data !== null)
      expect(data.login).toBeNull()
    })

    it('should succeed login user ', async () => {
      if (!testArgs.server) {
        throw new Error('Test server is not initialized')
      }
      const response =
        await testArgs.server.executeOperation<LoginUserMutation>({
          query: LOGIN,
          variables: {
            data: {
              email: validUserInfo.email,
              password: validUserInfo.password,
            },
          },
        })

      // Check API response.
      assert(response.body.kind === 'single')
      const { data, errors } = response.body.singleResult
      expect(errors).toBeUndefined()
      expect(data).toBeDefined()
      assert(data !== undefined && data !== null && data.login !== null)
      expect(Number(data.login.id)).toBe(testArgs.data.userId)
    })
  })
}
