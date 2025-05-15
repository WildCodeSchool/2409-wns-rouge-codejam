export enum Language {
  JS = "javascript",
  TS = "typescript",
}

export type ShResult = {
  status: "success" | "error" | "timeout"
  result: string
}
