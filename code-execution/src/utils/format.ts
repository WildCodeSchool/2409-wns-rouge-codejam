/**
 * Extracts and formats the first JavaScript error message from a raw `stderr` string.
 *
 * Searches for a recognizable JavaScript error pattern (e.g., "TypeError: ...", "ReferenceError: ...") and returns the first match. If no such error message is found, a default message is returned.
 *
 * @param {string} error - The raw error string (e.g., from `stderr` or a thrown error).
 * @returns {string} The extracted and cleaned error message, or a default fallback message.
 */
export function formatStdError(error: string): string {
  // Extract error message starting from JavaScript error type pattern (e.g., "TypeError", "ReferenceError", etc.)
  const javaScriptErrorRegex = /\b(?:\w+Error): .+/gim
  const match = error.trim().match(javaScriptErrorRegex)
  const formattedError = match
    ? match[0].trim()
    : 'Declaration or statement expected'

  return formattedError
}
