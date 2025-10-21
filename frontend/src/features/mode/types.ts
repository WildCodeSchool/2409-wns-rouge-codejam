export const MODE_OPTIONS = ['dark', 'light', 'system'] as const

export type Mode = (typeof MODE_OPTIONS)[number]
