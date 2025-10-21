import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react'
import { ToasterProps } from 'sonner'

export const TOASTER_OPTIONS: ToasterProps['toastOptions'] = {
  duration: 3000,
  classNames: {
    toast:
      'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
    description: 'group-[.toast]:text-muted-foreground',
    actionButton:
      'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium',
    cancelButton:
      'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium',
  },
}

export const TOAST_OPTIONS = {
  base: {
    dismissible: true,
    duration: TOASTER_OPTIONS.duration,
  },
  success: {
    description: '',
    Icon: <CircleCheckIcon className="h-5 w-5 text-green-500" />,
  },
  error: {
    description: 'Please try again later.',
    Icon: <CircleAlertIcon className="h-5 w-5 text-red-600" />,
  },
}
