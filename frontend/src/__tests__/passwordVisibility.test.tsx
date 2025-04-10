import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PasswordVisibiltyInput from '@/features/auth/components/PasswordVisibiltyInput'

describe('Password visibility input', () => {
  it('should switch the visibilty of the password when we click on the eye', () => {
    render(<PasswordVisibiltyInput name="password" />)
    const button = screen.getByRole('button', { name: 'Show password' })
    const input = screen.getByTestId('custom-password-field')
    expect(input).toHaveAttribute('type', 'password')
    fireEvent.click(button)
    expect(input).toHaveAttribute('type', 'text')
  })
})
