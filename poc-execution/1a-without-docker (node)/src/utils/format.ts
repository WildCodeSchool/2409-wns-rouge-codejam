/**
 *
 * @param error stderr error message to be formatted
 * @returns
 */
export function formatStdError(error: string): string {
  const sanitizedError = error.replaceAll('\n', '')
  const startIndex = sanitizedError.search(/\w*Error/m)
  const endIndex = sanitizedError.search(/\s(at)\s/m)
  return sanitizedError.slice(startIndex, endIndex + 1).trim()
}
