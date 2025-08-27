import { useCallback, useState } from 'react'

export type AuthModal = 'signIn' | 'signUp' | null

export default function useActions() {
  const [modal, setModal] = useState<AuthModal>(null)

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])
  const openSignIn = useCallback(() => {
    setModal('signIn')
  }, [])
  const openSignUp = useCallback(() => {
    setModal('signUp')
  }, [])

  return { modal, closeModal, openSignIn, openSignUp }
}
