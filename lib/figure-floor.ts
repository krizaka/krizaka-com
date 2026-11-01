/* « More than N »: a public count is never stated exactly (founder, 2026-11-01). The real count is read at build, then
   rounded DOWN to a clean step and always strictly below it, so « plus de N » stays true when the count grows or equals
   the step. Steps: under 10 → 5; 100 → 10; 1 000 → 50; 10 000 → 500; 100 000 → 5 000; then 50 000. Below 5 nothing is said (0 hides the
   figure). Pure; tested by tests/figure-floor.test.mjs. Never round up. */

export function figureStep(count: number): number {
  if (count < 10) return 5;
  if (count < 100) return 10;
  if (count < 1000) return 50;
  if (count < 10000) return 500;
  if (count < 100000) return 5000;
  return 50000;
}

export function floorFigure(count: number): number {
  if (!Number.isFinite(count) || count < 1) return 0;
  const n = Math.floor(count);
  const step = figureStep(n);
  return Math.floor((n - 1) / step) * step;
}
