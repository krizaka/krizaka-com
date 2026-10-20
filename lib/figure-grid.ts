/* How many columns a row of key figures takes, so that the grid never leaves an empty cell (the coordinator, 2026-10-20:
   five tiles wrapped 4 + 1 on /open-source and left a grey hole). `wide`: from 640 px; `narrow`: phones. Every count
   divides by both, so each row is full. Pure; tested by tests/figure-grid.test.mjs. */

export interface FigureColumns {
  wide: number;
  narrow: number;
}

export function figureColumns(count: number): FigureColumns {
  const n = Math.max(1, Math.floor(count));
  const wide = n <= 5 ? n : n % 4 === 0 ? 4 : n % 3 === 0 ? 3 : n % 2 === 0 ? 2 : 1;
  const narrow = n % 2 === 0 ? 2 : n === 3 ? 3 : 1;
  return { wide, narrow };
}
