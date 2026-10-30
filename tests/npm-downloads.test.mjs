import test from "node:test";
import assert from "node:assert/strict";
import { rangeWindow, weeklyBuckets, sumKnown } from "../scripts/npm-downloads-lib.mjs";

const days = (start, counts) =>
  counts.map((downloads, i) => ({
    day: new Date(Date.parse(start) + i * 864e5).toISOString().slice(0, 10),
    downloads,
  }));

test("the window is the 84 days that end on the given day, inclusive", () => {
  assert.deepEqual(rangeWindow("2026-10-18", 12), { start: "2026-07-27", end: "2026-10-18" });
});

test("12 weekly sums, oldest first, from the npm range payload (fixture)", () => {
  const w = rangeWindow("2026-10-18", 12);
  const counts = Array.from({ length: 84 }, (_, i) => Math.floor(i / 7) + 1); // week k: 7 * k
  const payload = { start: w.start, end: w.end, package: "@krizaka/ui", downloads: days(w.start, counts) };
  assert.deepEqual(weeklyBuckets(payload, "2026-10-18", 12), [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84]);
});

test("the last bucket ends on the end day: the newest week is the one `last-week` reports", () => {
  const w = rangeWindow("2026-10-18", 12);
  const counts = Array.from({ length: 84 }, (_, i) => (i >= 77 ? 100 : 1));
  const out = weeklyBuckets({ downloads: days(w.start, counts) }, "2026-10-18", 12);
  assert.equal(out.at(-1), 700);
  assert.equal(out[0], 7);
});

test("fail soft: a gap, a malformed payload or a non-integer gives null, never a wrong number", () => {
  const w = rangeWindow("2026-10-18", 12);
  const ok = days(w.start, Array(84).fill(1));
  assert.equal(weeklyBuckets(null, "2026-10-18", 12), null);
  assert.equal(weeklyBuckets({ error: "not found" }, "2026-10-18", 12), null);
  assert.equal(weeklyBuckets({ downloads: ok.slice(1) }, "2026-10-18", 12), null, "a missing day");
  assert.equal(
    weeklyBuckets({ downloads: [...ok.slice(0, 83), { day: ok[83].day, downloads: "12" }] }, "2026-10-18", 12),
    null,
  );
  assert.equal(
    weeklyBuckets({ downloads: [...ok.slice(0, 83), { day: ok[83].day, downloads: -1 }] }, "2026-10-18", 12),
    null,
  );
});

test("sumKnown adds the figures that exist and says nothing when none does", () => {
  assert.equal(sumKnown([4968, undefined, 12, null]), 4980);
  assert.equal(sumKnown([undefined, null]), undefined);
  assert.equal(sumKnown([]), undefined);
});
