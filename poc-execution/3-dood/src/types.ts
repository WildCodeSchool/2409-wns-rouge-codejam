export enum Language {
  JS = "javascript",
  TS = "typescript",
}

export type ShResult = {
  status: "success" | "error" | "timeout"
  result: string
}

export function isErrorWithStatus(error: unknown): error is ShResult {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "result" in error
  )
}
