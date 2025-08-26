/**
 * Format the error message from stderr
 * @param error stderr error message to be formatted
 * @returns
 */
export function formatStdError(error: string): string {
  const lines = error.split('\n')
  const pattern = new RegExp(/\b\w*Error:/)
  for (const line of lines) {
    const startIndex = line.search(pattern)
    if (startIndex !== -1) {
      return line.slice(startIndex)
    }
  }
  return ''
}
