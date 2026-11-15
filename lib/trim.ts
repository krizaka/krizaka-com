/* Linear-time trimming helpers: a regex such as /\/+$/ or /\s+\S*$/ backtracks quadratically on a long run of the character. */

const isSpace = (c: string) => c.trim() === "";

/** `s` without its trailing `/` characters. */
export function stripTrailingSlashes(s: string): string {
  let end = s.length;
  while (end > 0 && s[end - 1] === "/") end--;
  return s.slice(0, end);
}

/** `s` without its trailing dots and whitespace, then one final period. */
export function withFinalPeriod(s: string): string {
  let end = s.length;
  while (end > 0 && (s[end - 1] === "." || isSpace(s[end - 1]))) end--;
  return `${s.slice(0, end)}.`;
}

/** `s` without its last word and the whitespace before it (a string with no whitespace is returned as it is). */
export function dropLastWord(s: string): string {
  let i = s.length - 1;
  while (i >= 0 && !isSpace(s[i])) i--;
  if (i < 0) return s;
  while (i > 0 && isSpace(s[i - 1])) i--;
  return s.slice(0, i);
}
