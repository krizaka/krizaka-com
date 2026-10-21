/* The captions of a take on /story: pure, so the route and the tests share them. */

export type TakeCues = readonly (readonly [number, number])[];

const clock = (t: number) => {
  const ms = Math.round(t * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3_600_000))}:${p(Math.floor((ms % 3_600_000) / 60_000))}:${p(Math.floor((ms % 60_000) / 1000))}.${p(ms % 1000, 3)}`;
};

/** The captions of a take in WebVTT: one line of words per cue, at the take's own times (served same-origin, a <track> from the CDN needs CORS). */
export function takeVtt(cues: TakeCues, words: readonly string[]): string {
  return `WEBVTT\n\n${cues.map(([a, b], i) => `${clock(a)} --> ${clock(b)}\n${words[i] ?? ""}\n`).join("\n")}`;
}
