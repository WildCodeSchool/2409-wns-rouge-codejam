import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(delayInMs = 1500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, delayInMs)
  })
}
