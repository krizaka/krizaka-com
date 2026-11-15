/* How many columns a row of key figures takes, so that the grid never leaves an empty cell (the coordinator, 2026-10-20:
   five tiles wrapped 4 + 1 on /open-source and left a grey hole). `wide`: from 640 px; `narrow`: phones. Every count
   divides by both, so each row is full. Pure; tested by tests/figure-grid.test.mjs. */

export interface FigureColumns {
  wide: number;
  narrow: number;
}

/** The first of `candidates` that divides `n`, else 1. */
function largestDivisor(n: number, candidates: readonly number[]): number {
  return candidates.find((c) => n % c === 0) ?? 1;
}

export function figureColumns(count: number): FigureColumns {
  const n = Math.max(1, Math.floor(count));
  const wide = n <= 5 ? n : largestDivisor(n, [4, 3, 2]);
  const narrow = n === 3 ? 3 : largestDivisor(n, [2]);
  return { wide, narrow };
}
