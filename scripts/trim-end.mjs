/** `s` without the run of `char` (one character) at its end: a linear scan, where `/x+$/` backtracks in O(n²). */
export function trimEnd(s, char) {
  let end = s.length;
  while (end > 0 && s[end - 1] === char) {
    end--;
  }
  return s.slice(0, end);
}
