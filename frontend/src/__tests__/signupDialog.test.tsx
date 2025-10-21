import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import SignUpForm from '@/features/auth/components/SignUpForm'

import { CREATE_USER } from '@/shared/api/createUser'
import { CreateUserMutation, UserCreateInput } from '@/shared/gql/graphql'
import { Modal } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
import { Toaster } from '@/shared/components/ui/sonner'

const mocks: MockedResponse<CreateUserMutation, { data: UserCreateInput }> = {
  request: {
    query: CREATE_USER,
    variables: {
      data: {
        email: 'john.doe@gmail.com',
        username: 'john.doe',
        password: 'SuperSecret!123456',
      },
    },
  },
  result: {
    data: {
      createUser: {
        id: '1',
        email: 'john.doe@gmail.com',
        username: 'john.doe',
      },
    },
  },
}

function MockedSignupDialog() {
  const [showModal, setShowModal] = useState(false)
  const closeModal = () => {
    setShowModal(false)
  }
  return (
    <div>
      <MockedProvider mocks={[mocks]}>
        <div className="flex flex-row items-center gap-4">
          <Button
            data-testid="navbar-signup"
            onClick={() => {
              setShowModal(true)
            }}
          >
            Sign Up
          </Button>

          {showModal && (
            <Modal open title="Sign Up" onOpenChange={setShowModal}>
              <SignUpForm onSignIn={() => null} callbackOnSubmit={closeModal} />
            </Modal>
          )}
        </div>
      </MockedProvider>
      <Toaster />
    </div>
  )
}

describe('SignUp dialog', () => {
  it('should renders the signup button', () => {
    render(<MockedSignupDialog />)
    screen.getByTestId('navbar-signup')
  })

  it('should renders the signup form after a click on the associated button', () => {
    render(<MockedSignupDialog />)
    const button = screen.getByTestId('navbar-signup')
    fireEvent.click(button)
    screen.getByTestId('signup-form')
  })

  it('should not submit the values after a click on the submit button when email value is incorrect (missing @)', async () => {
    render(<MockedSignupDialog />)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(button)

    const email = screen.getByTestId<HTMLInputElement>('email-input')
    await userEvent.clear(email)
    await userEvent.type(email, 'john.doe.com')

    const username = screen.getByTestId<HTMLInputElement>('username-input')
    await userEvent.clear(username)
    await userEvent.type(username, 'john.doe')

    const password = screen.getByTestId<HTMLInputElement>('password-input')
    await userEvent.clear(password)
    await userEvent.type(password, 'SuperSecret!123456')

    const confirmPassword = screen.getByTestId<HTMLInputElement>(
      'confirm-password-input',
    )
    await userEvent.clear(confirmPassword)
    await userEvent.type(confirmPassword, 'SuperSecret!123456')

    // Simulate "Tab" input from the user to trigger the zod error
    await userEvent.keyboard('{Tab}')

    // Error should be visible
    const error = screen.getByText(
      /Please provide a valid email address \(example: name@example\.com\)/,
    )
    expect(error).toBeVisible()

    const submitButton = screen.getByTestId('submit-signup')
    fireEvent.click(submitButton)

    // Form modal should be already visible
    await vi.waitFor(() => {
      expect(screen.getByRole('form', { name: 'signup form' })).toBeVisible()
    })
  })

  it('should not submit the values after a click on the submit button when username value is incorrect (less than 2 characters)', async () => {
    render(<MockedSignupDialog />)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(button)

    const email = screen.getByTestId<HTMLInputElement>('email-input')
    await userEvent.clear(email)
    await userEvent.type(email, 'john.doe@gmail.com')

    const username = screen.getByTestId<HTMLInputElement>('username-input')
    await userEvent.clear(username)
    await userEvent.type(username, 'j')

    const password = screen.getByTestId<HTMLInputElement>('password-input')
    await userEvent.clear(password)
    await userEvent.type(password, 'SuperSecret!123456')

    const confirmPassword = screen.getByTestId<HTMLInputElement>(
      'confirm-password-input',
    )
    await userEvent.clear(confirmPassword)
    await userEvent.type(confirmPassword, 'SuperSecret!123456')

    // Simulate "Tab" input from the user to trigger the zod error
    await userEvent.keyboard('{Tab}')

    // Error should be visible
    const error = screen.getByText(
      /Username must contain at least 2 characters/,
    )
    expect(error).toBeVisible()

    const submitButton = screen.getByTestId('submit-signup')
    fireEvent.click(submitButton)

    // Form modal should be already visible
    await vi.waitFor(() => {
      expect(screen.getByRole('form', { name: 'signup form' })).toBeVisible()
    })
  })

  it('should not submit the values after a click on the submit button when password value is incorrect (less than 12 characters)', async () => {
    render(<MockedSignupDialog />)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(button)

    const formModal = screen.getByRole('form', { name: 'signup form' })

    const email = screen.getByTestId<HTMLInputElement>('email-input')
    await userEvent.clear(email)
    await userEvent.type(email, 'john.doe@gmail.com')

    const username = screen.getByTestId<HTMLInputElement>('username-input')
    await userEvent.clear(username)
    await userEvent.type(username, 'john.doe')

    const password = screen.getByTestId<HTMLInputElement>('password-input')
    await userEvent.clear(password)
    await userEvent.type(password, 'SuperSecret')

    const confirmPassword = screen.getByTestId<HTMLInputElement>(
      'confirm-password-input',
    )
    await userEvent.clear(confirmPassword)
    await userEvent.type(confirmPassword, 'SuperSecret')

    // Simulate "Tab" input from the user to trigger the zod error
    await userEvent.keyboard('{Tab}')

    // Error should be visible
    const error = screen.getByText(/Must contain at least 12 characters/)
    expect(error).toBeVisible()

    // Form modal should be already visible after clicking on submit button
    const submitButton = screen.getByTestId('submit-signup')
    fireEvent.click(submitButton)

    await vi.waitFor(() => {
      expect(formModal).toBeVisible()
    })
  })

  it('should not submit the values after a click on the submit button when password value is incorrect (missing uppercase letter)', async () => {
    render(<MockedSignupDialog />)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(button)

    const formModal = screen.getByRole('form', { name: 'signup form' })

    const email = screen.getByTestId<HTMLInputElement>('email-input')
    await userEvent.clear(email)
    await userEvent.type(email, 'john.doe@gmail.com')

    const username = screen.getByTestId<HTMLInputElement>('username-input')
    await userEvent.clear(username)
    await userEvent.type(username, 'john.doe')

    const password = screen.getByTestId<HTMLInputElement>('password-input')
    await userEvent.clear(password)
    await userEvent.type(password, 'supersecretsupersecret')

    const confirmPassword = screen.getByTestId<HTMLInputElement>(
      'confirm-password-input',
    )
    await userEvent.clear(confirmPassword)
    await userEvent.type(confirmPassword, 'supersecretsupersecret')

    // Simulate "Tab" input from the user to trigger the zod error
    await userEvent.keyboard('{Tab}')

    // Error should be visible
    const error = screen.getByText(/Must contain at least an uppercase letter/)
    expect(error).toBeVisible()

    // Form modal should be already visible after clicking on submit button
    const submitButton = screen.getByTestId('submit-signup')
    fireEvent.click(submitButton)

    await vi.waitFor(() => {
      expect(formModal).toBeVisible()
    })
  })

  it('should not submit the values after a click on the submit button when password value is incorrect (missing number)', async () => {
    render(<MockedSignupDialog />)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(button)

    const formModal = screen.getByRole('form', { name: 'signup form' })

    const email = screen.getByTestId<HTMLInputElement>('email-input')
    await userEvent.clear(email)
    await userEvent.type(email, 'john.doe@gmail.com')

    const username = screen.getByTestId<HTMLInputElement>('username-input')
    await userEvent.clear(username)
    await userEvent.type(username, 'john.doe')

    const password = screen.getByTestId<HTMLInputElement>('password-input')
    await userEvent.clear(password)
    await userEvent.type(password, 'SuperSecretSuperSecret')

    const confirmPassword = screen.getByTestId<HTMLInputElement>(
      'confirm-password-input',
    )
    await userEvent.clear(confirmPassword)
    await userEvent.type(confirmPassword, 'SuperSecretSuperSecret')

    // Simulate "Tab" input from the user to trigger the zod error
    await userEvent.keyboard('{Tab}')

    // Error should be visible
    const error = screen.getByText(/Must contain at least a number/)
    expect(error).toBeVisible()

    // Form modal should be already visible after clicking on submit button
    const submitButton = screen.getByTestId('submit-signup')
    fireEvent.click(submitButton)

    await vi.waitFor(() => {
      expect(formModal).toBeVisible()
    })
  })

  it('should not submit the values after a click on the submit button when password value is incorrect (missing special character)', async () => {
    render(<MockedSignupDialog />)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(button)

    const formModal = screen.getByRole('form', { name: 'signup form' })

    const email = screen.getByTestId<HTMLInputElement>('email-input')
    await userEvent.clear(email)
    await userEvent.type(email, 'john.doe@gmail.com')

    const username = screen.getByTestId<HTMLInputElement>('username-input')
    await userEvent.clear(username)
    await userEvent.type(username, 'john.doe')

    const password = screen.getByTestId<HTMLInputElement>('password-input')
    await userEvent.clear(password)
    await userEvent.type(password, 'SuperSecret123456')

    const confirmPassword = screen.getByTestId<HTMLInputElement>(
      'confirm-password-input',
    )
    await userEvent.clear(confirmPassword)
    await userEvent.type(confirmPassword, 'SuperSecret123456')

    // Simulate "Tab" input from the user to trigger the zod error
    await userEvent.keyboard('{Tab}')

    // Error should be visible
    const error = screen.getByText(/Must contain at least a special character/)
    expect(error).toBeVisible()

    // Form modal should be already visible after clicking on submit button
    const submitButton = screen.getByTestId('submit-signup')
    fireEvent.click(submitButton)

    await vi.waitFor(() => {
      expect(formModal).toBeVisible()
    })
  })

  it('should not submit the values after a click on the submit button when password value is not corresponding confirm password value', async () => {
    render(<MockedSignupDialog />)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(button)

    const formModal = screen.getByRole('form', { name: 'signup form' })

    const email = screen.getByTestId<HTMLInputElement>('email-input')
    await userEvent.clear(email)
    await userEvent.type(email, 'john.doe@gmail.com')

    const username = screen.getByTestId<HTMLInputElement>('username-input')
    await userEvent.clear(username)
    await userEvent.type(username, 'john.doe')

    const password = screen.getByTestId<HTMLInputElement>('password-input')
    await userEvent.clear(password)
    await userEvent.type(password, 'SuperSecret!123456')

    const confirmPassword = screen.getByTestId<HTMLInputElement>(
      'confirm-password-input',
    )
    await userEvent.clear(confirmPassword)
    await userEvent.type(confirmPassword, 'SuperSecret!1234567')

    // Simulate "Tab" input from the user to trigger the zod error
    await userEvent.keyboard('{Tab}')

    // Error should be visible
    const error = screen.getByText(/Passwords don't match/)
    expect(error).toBeVisible()

    // Form modal should be already visible after clicking on submit button
    const submitButton = screen.getByTestId('submit-signup')
    fireEvent.click(submitButton)

    await vi.waitFor(() => {
      expect(formModal).toBeVisible()
    })
  })

  it('should submit the correct values after a click on the submit button', async () => {
    render(<MockedSignupDialog />)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(button)

    const email = screen.getByTestId<HTMLInputElement>('email-input')
    await userEvent.clear(email)
    await userEvent.type(email, 'john.doe@gmail.com')

    const username = screen.getByTestId<HTMLInputElement>('username-input')
    await userEvent.clear(username)
    await userEvent.type(username, 'john.doe')

    const password = screen.getByTestId<HTMLInputElement>('password-input')
    await userEvent.clear(password)
    await userEvent.type(password, 'SuperSecret!123456')

    const confirmPassword = screen.getByTestId<HTMLInputElement>(
      'confirm-password-input',
    )
    await userEvent.clear(confirmPassword)
    await userEvent.type(confirmPassword, 'SuperSecret!123456')

    // Password input should be equal to confirm password input
    expect(password.value).toBe(confirmPassword.value)

    if (mocks.request.variables === undefined) {
      throw new Error('Undefined query variables')
    }
    const testValue = mocks.request.variables

    // Input values should match with the mock values
    expect(email.value).toBe(testValue.data.email)
    expect(username.value).toBe(testValue.data.username)
    expect(password.value).toBe(testValue.data.password)
    expect(confirmPassword.value).toBe(testValue.data.password)

    const submitButton = screen.getByTestId('submit-signup')
    fireEvent.click(submitButton)

    // Form modal should close
    await waitForElementToBeRemoved(() =>
      screen.getByRole('form', { name: 'signup form' }),
    )

    // Toast should become visible and show the correct message
    await vi.waitFor(() => {
      expect(screen.getByText(/Welcome john.doe/)).toBeVisible()
    })
  })
})
