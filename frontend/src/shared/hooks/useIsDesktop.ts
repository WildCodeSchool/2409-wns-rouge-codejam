import { useEffect, useState } from 'react'

export const DESKTOP_BREAKPOINT = 1024

export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(
      `(min-width:${String(DESKTOP_BREAKPOINT + 1)}px)`,
    )
    const onChange = () => {
      setIsDesktop(window.innerWidth > DESKTOP_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsDesktop(window.innerWidth > DESKTOP_BREAKPOINT)
    return () => {
      mql.removeEventListener('change', onChange)
    }
  }, [])

  return !!isDesktop
}
