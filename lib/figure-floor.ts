/* « More than N »: a public count is never stated exactly (founder, 2026-11-01). The real count is read at build, then
   rounded DOWN to a clean step and always strictly below it, so « plus de N » stays true when the count grows or equals
   the step. Steps: under 10 → 5; 100 → 10; 1 000 → 50; 10 000 → 500; 100 000 → 5 000; then 50 000. Below 5 nothing is said (0 hides the
   figure). Pure; tested by tests/figure-floor.test.mjs. Never round up. */

const STEPS: readonly (readonly [below: number, step: number])[] = [
  [10, 5],
  [100, 10],
  [1000, 50],
  [10000, 500],
  [100000, 5000],
];

const LAST_STEP = 50000;

export function figureStep(count: number): number {
  return STEPS.find(([below]) => count < below)?.[1] ?? LAST_STEP;
}

export function floorFigure(count: number): number {
  const n = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  return n < 1 ? 0 : Math.floor((n - 1) / figureStep(n)) * figureStep(n);
}
