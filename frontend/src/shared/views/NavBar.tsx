import { useState } from 'react'
import SignInForm from '@/features/auth/components/SignInForm'
import SignUpForm from '@/features/auth/components/SignUpForm'
import { Button } from '@/shared/components/ui/button'
import Modal from '@/shared/components/Modal'

const NavBar = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>()
  const showModal = isSignIn !== undefined

  const closeModal = () => {
    setIsSignIn(undefined)
  }

  return (
    <header className="flex flex-row items-center justify-between border-b pb-4">
      <h1 className="text-xl font-bold">CodeJam</h1>
      <div className="flex flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsSignIn(true)
          }}
        >
          Sign In
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setIsSignIn(false)
          }}
        >
          Sign Up
        </Button>
        {showModal && (
          <Modal
            open
            title={isSignIn ? 'Sign In' : 'SignUp'}
            onOpenChange={closeModal}
          >
            {isSignIn ? (
              <SignInForm />
            ) : (
              <SignUpForm callbackOnSubmit={closeModal} />
            )}
          </Modal>
        )}
      </div>
    </header>
  )
}

export default NavBar
