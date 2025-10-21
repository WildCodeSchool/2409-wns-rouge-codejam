/**
 * Resolves the appropriate background color for the output panel
 * based on the current theme mode.
 *
 * @param isDarkMode - Whether dark mode is currently active.
 * @returns The background color value from the corresponding theme.
 */
export default function resolveOutputBackgroundColor(
  isDarkMode: boolean,
): string {
  return isDarkMode ? 'bg-[#24292e]' : 'bg-[#FFFFFF]'
}
