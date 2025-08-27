import { AuthModal } from '@/features/auth/components'
import { useActions } from '@/features/auth/hooks'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'

export default function NavActions() {
  const { modal, closeModal, openSignIn, openSignUp } = useActions()

  return (
    <>
      <Button
        variant="outline"
        data-testid="navbar-signin"
        onClick={openSignIn}
        className="min-w-20"
      >
        Sign In
      </Button>
      <Button
        data-testid="navbar-signup"
        onClick={openSignUp}
        className="min-w-20"
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

export function NavActionsSkeleton() {
  return (
    <div className="flex flex-row items-center gap-4">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  )
}
