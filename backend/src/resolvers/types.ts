export type CodeExecutionResponse = {
  status: string
  result: string
}

export type CodeExecutionRequest = {
  script: string
  language: string
}
