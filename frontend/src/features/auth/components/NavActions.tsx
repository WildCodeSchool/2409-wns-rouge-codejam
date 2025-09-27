import { AuthModal } from '@/features/auth/components'
import { useActions } from '@/features/auth/hooks'
import { Button } from '@/shared/components/ui/button'

export default function NavActions() {
  const { modal, closeModal, openSignIn, openSignUp } = useActions()

  return (
    <>
      <Button
        variant="outline"
        data-testid="navbar-signin"
        onClick={openSignIn}
        className="min-w-22"
      >
        Sign In
      </Button>
      <Button
        data-testid="navbar-signup"
        onClick={openSignUp}
        className="min-w-22"
      >
        Sign Up
      </Button>

      {modal && (
        <AuthModal
          modal={modal}
          closeModal={closeModal}
          openSignIn={openSignIn}
          openSignUp={openSignUp}
        />
      )}
    </>
  )
}
