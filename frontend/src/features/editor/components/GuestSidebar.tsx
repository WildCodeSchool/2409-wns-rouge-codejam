import SignInForm from '@/features/auth/components/SignInForm'
import SignUpForm from '@/features/auth/components/SignUpForm'
import Modal from '@/shared/components/Modal'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'

export default function EditorSidebar() {
  const [isSignIn, setIsSignIn] = useState<boolean | undefined>()
  const showModal = isSignIn !== undefined

  const closeModal = () => {
    setIsSignIn(undefined)
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-neutral-900 p-4 text-neutral-300">
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
        <span className="pr-1">Don&apos;t have an account?</span>
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
  )
}
