import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

import { TOASTER_OPTIONS } from '@/shared/config'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={TOASTER_OPTIONS}
      {...props}
    />
  )
}

export { Toaster }
