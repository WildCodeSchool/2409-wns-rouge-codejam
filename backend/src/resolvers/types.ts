export type CodeExecutionResponse = {
  status: 'success' | 'error'
  result: string
}

export type CodeExecutionRequest = {
  script: string
  language: string
}

export enum ExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}
