import { AnimatePresence, motion, MotionProps } from 'motion/react'

import { SignInForm, SignUpForm } from '@/features/auth/components'
import { type AuthModal as TAuthModal } from '@/features/auth/hooks'
import { Modal } from '@/shared/components'

const BASE_MOTION_CONFIG: MotionProps = {
  layout: true,
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.3, ease: 'easeInOut' },
}

type AuthModalProps = {
  modal?: TAuthModal
  closeModal: () => void
  openSignIn: () => void
  openSignUp: () => void
}

export default function AuthModal({
  modal,
  closeModal,
  openSignIn,
  openSignUp,
}: AuthModalProps) {
  return (
    <Modal
      open
      title={modal === 'signIn' ? 'Sign In' : 'Sign Up'}
      titleKey={modal} // 👈 important for animation
      onOpenChange={closeModal}
      className="overflow-hidden"
    >
      <motion.div
        layout
        className="relative mx-auto w-full"
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {modal === 'signIn' ? (
            <motion.div
              key="signin"
              {...BASE_MOTION_CONFIG}
              initial={{ x: -50, opacity: 0 }}
              exit={{ x: 50, opacity: 0 }}
            >
              <SignInForm
                key="signin-modal"
                onSignUp={openSignUp}
                callbackOnSubmit={closeModal}
              />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              {...BASE_MOTION_CONFIG}
              initial={{ x: 50, opacity: 0 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <SignUpForm
                key="signup-modal"
                onSignIn={openSignIn}
                callbackOnSubmit={openSignIn}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Modal>
  )
}
