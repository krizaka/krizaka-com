/* The holiday pause of the demos, as data: from `start` to `end` (month, day, both included) nobody answers a demo request, so the
   confirmation says when the demos resume (the day after `end`) instead of promising a reply within two business days. */
export const DEMO_PAUSE = { start: { month: 12, day: 21 }, end: { month: 1, day: 3 } } as const;

/** The day the demos resume (a UTC-midnight Date, formatted by the caller) when `now` falls inside the pause, else null. */
export function demoResumeDate(now: Date): Date | null {
  const { start, end } = DEMO_PAUSE;
  const year = now.getFullYear();
  const key = (m: number, d: number) => m * 100 + d;
  const today = key(now.getMonth() + 1, now.getDate());
  const wraps = key(start.month, start.day) > key(end.month, end.day);
  const inside = wraps
    ? today >= key(start.month, start.day) || today <= key(end.month, end.day)
    : today >= key(start.month, start.day) && today <= key(end.month, end.day);
  if (!inside) return null;
  const endYear = wraps && today >= key(start.month, start.day) ? year + 1 : year;
  return new Date(Date.UTC(endYear, end.month - 1, end.day + 1));
}
