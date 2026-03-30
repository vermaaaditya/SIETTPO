/**
 * Conditionally joins class names into a single space-separated string.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
