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

  // "Check file: ..." is a log of deno check operation
  return lines[0].includes("Check file") ? lines.slice(1, lines.length) : lines;
}
// export function formatStdError(error: string): string {
//   const lines = error.split("\n");
//   const pattern = new RegExp(/\b\w*Error:/);
//   for (const line of lines) {
//     const startIndex = line.search(pattern);
//     if (startIndex !== -1) {
//       return line.slice(startIndex);
//     }
//   }
//   console.log(error);
//   return "";
// }
