import { Suspense } from 'react'
import EditorContainer from '@/features/editor/components/EditorContainer'
import EditorSidebar from '../../features/editor/components/EditorSidebar'
import { useSuspenseQuery } from '@apollo/client'
import { WHO_AM_I } from '../api/whoAmI'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'
import SignInForm from '@/features/auth/components/SignInForm'
import SignUpForm from '@/features/auth/components/SignUpForm'
import Modal from '@/shared/components/Modal'

const HomePage = () => {
  const { data: { whoAmI: user } = {} } = useSuspenseQuery(WHO_AM_I)
  const [isSignIn, setIsSignIn] = useState<boolean | undefined>()
  const showModal = isSignIn !== undefined

  const closeModal = () => {
    setIsSignIn(undefined)
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="flex h-screen">
        <div className="h-screen flex-shrink-0">
          {user ? (
            <EditorSidebar />
          ) : (
            <div className="flex h-full max-w-[300px] flex-col items-center justify-center gap-4 bg-neutral-900 p-4 text-neutral-300">
              <h1 className="text-2xl font-bold">Welcome to Codejam</h1>
              <p className="text-center text-sm">
                Please sign in to create snippets and share them with others.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsSignIn(true)
                }}
              >
                Sign In
              </Button>
              <p className="text-center text-sm">
                Don&apos;t have an account?
                <span
                  className="cursor-pointer text-sky-500 hover:underline"
                  onClick={() => {
                    setIsSignIn(false)
                  }}
                >
                  Sign up
                </span>
              </p>
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
          )}
        </div>
        <div className="min-w-0 flex-1">
          <EditorContainer />
        </div>
      </div>
    </Suspense>
  )
}

export default HomePage
