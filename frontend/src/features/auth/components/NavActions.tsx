import { useSuspenseQuery } from '@apollo/client'
import { useState } from 'react'

import UserInfo from '@/features/auth/components/UserInfo'
import SignInForm from '@/features/auth/components/SignInForm'
import SignUpForm from '@/features/auth/components/SignUpForm'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import { Modal } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'

export default function NavActions() {
  const [isSignIn, setIsSignIn] = useState<boolean>()
  const { data: { whoAmI: user } = {} } = useSuspenseQuery(WHO_AM_I)

  const isUserLoggedIn = user !== null && user !== undefined
  const showModal = isSignIn !== undefined

  const closeModal = () => {
    setIsSignIn(undefined)
  }

  return (
    <div className="flex flex-row items-center gap-4">
      {isUserLoggedIn ? (
        <UserInfo user={user} />
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => {
              setIsSignIn(true)
            }}
          >
            Sign In
          </Button>
          <Button
            data-testid="navbar-signup"
            onClick={() => {
              setIsSignIn(false)
            }}
          >
            Sign Up
          </Button>
        </>
      )}

      {showModal && (
        <Modal
          open
          title={isSignIn ? 'Sign In' : 'Sign Up'}
          onOpenChange={closeModal}
        >
          {isSignIn ? (
            <SignInForm
              onSignUp={() => {
                setIsSignIn(false)
              }}
              callbackOnSubmit={closeModal}
            />
          ) : (
            <SignUpForm
              onSignIn={() => {
                setIsSignIn(true)
              }}
              callbackOnSubmit={closeModal}
            />
          )}
        </Modal>
      )}
    </div>
  )
}
