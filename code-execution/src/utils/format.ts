/**
 * Format the error message from stderr
 * @param error stderr error message to be formatted
 * @returns
 */
export function formatStdError(error: string): string[] {
  // Regex to match ANSI escape codes (used for colored terminal output)
  const ansiRegex = /\x1b\[[0-9;]*m/g;
  const cleanError = error.replace(ansiRegex, "").trim();
  const lines = cleanError.split("\n");

  /* If it's a Deno error, skip the first two lines (usually contain file path and error indicator)
  and return the actual error message lines */
  if (lines[0].includes("error: ")) {
    return lines.slice(2).filter(line => line.trim() !== "");
  }
  
  // For other types of errors, return all non-empty lines
  return lines.filter(line => line.trim() !== "");
}