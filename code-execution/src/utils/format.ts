import { types } from "node:util"

/**
 * Format the error message from stderr
 * @param error stderr error message to be formatted
 * @returns
 */
export function formatStdError(error: string): string[] {
  const cleanError = stripAnsiCodes(error)
  const lines = cleanError.split('\n')

  if (isDenoError(lines)) {
    return filterErrorLines(lines.slice(2))
  }

  return filterErrorLines(lines)
}

// Remove ANSI escape codes from error text
function stripAnsiCodes(text: string): string {
  const ansiRegex = /\x1b\[[0-9;]*m/g
  return text.replace(ansiRegex, '').trim()
}

// Check if the error is a Deno-specific error
function isDenoError(lines: string[]): boolean {
  return lines.length > 0 && lines[0].includes("error: The module's source")
}

// Filter out empty lines and file path references
function filterErrorLines(lines: string[]): string[] {
  return lines.filter((line) => {
    const trimmedLine = line.trim()
    return trimmedLine !== '' && !trimmedLine.includes('tmp')
  })
}
