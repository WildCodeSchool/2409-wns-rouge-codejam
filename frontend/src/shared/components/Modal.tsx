import { AnimatePresence, motion, MotionProps } from 'motion/react'

import { AuthModal } from '@/features/auth/hooks'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

const BASE_MOTION_CONFIG: MotionProps = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -0, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
}

export type ModalProps = React.PropsWithChildren & {
  title?: string
  titleKey?: AuthModal // 👈 key for animation (e.g. "signIn" | "signUp")
  className?: string
  open: boolean
  onOpenChange?: (nextOpen: boolean) => void
}

export default function Modal({
  title = 'Modal',
  titleKey = undefined,
  open,
  onOpenChange,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={titleKey} // 👈 triggers re-animation when switching
              {...BASE_MOTION_CONFIG}
            >
              <DialogTitle className="text-center text-3xl">
                {title}
              </DialogTitle>
            </motion.div>
          </AnimatePresence>
          <DialogDescription />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
