export const MODE_OPTIONS = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const

export type Mode = (typeof MODE_OPTIONS)[keyof typeof MODE_OPTIONS]
