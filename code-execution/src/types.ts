export enum Language {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
}

export enum ExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  TIMEOUT = 'timeout',
}

export type ShResult = {
  status: ExecutionStatus
  result: string
}

export function isErrorWithStatus(error: unknown): error is ShResult {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'result' in error
  )
}
