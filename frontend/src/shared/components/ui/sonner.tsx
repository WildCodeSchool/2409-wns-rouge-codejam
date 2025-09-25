import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

import { toasterOptions } from '@/shared/config'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={toasterOptions}
      {...props}
    />
  )
}

export { Toaster }
