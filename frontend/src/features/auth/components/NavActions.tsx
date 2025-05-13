import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useState } from 'react'
import { toast } from 'sonner'
import UserInfo from '@/features/auth/components/UserInfo'
import SignInForm from '@/features/auth/components/SignInForm'
import SignUpForm from '@/features/auth/components/SignUpForm'
import { LOGOUT } from '@/shared/api/logout'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import Modal from '@/shared/components/Modal'
import { Button } from '@/shared/components/ui/button'

export default function NavActions() {
  const [isSignIn, setIsSignIn] = useState<boolean>()
  const { data: { whoAmI: user } = {} } = useSuspenseQuery(WHO_AM_I)
  const [logout] = useMutation(LOGOUT)

  const isUserLoggedIn = user !== null && user !== undefined
  const showModal = isSignIn !== undefined

  const closeModal = () => {
    setIsSignIn(undefined)
  }

  const handleLogout = async (_e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (!user) return

      const { data, errors } = await logout({
        refetchQueries: [{ query: WHO_AM_I }],
      })

      if (errors !== undefined || !data?.logout) {
        if (errors) console.error('Failed to sign out:', errors)
        throw new Error('Failed to sign out!')
      }

      toast.success('Successful logout', {
        description: '👋 Hope to see you soon!',
      })
    } catch (error: unknown) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-row items-center gap-4">
      {isUserLoggedIn ? (
        <>
          <UserInfo user={user} />
          <Button onClick={handleLogout}>Sign Out</Button>
        </>
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
            variant="outline"
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
          title={isSignIn ? 'Sign In' : 'SignUp'}
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
