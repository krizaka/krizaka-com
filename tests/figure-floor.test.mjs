import { test } from "node:test";
import assert from "node:assert/strict";
import { floorFigure } from "../lib/figure-floor.ts";

test("floorFigure rounds down to a clean step, strictly below the real count", () => {
  assert.equal(floorFigure(36), 30);
  assert.equal(floorFigure(47), 40);
  assert.equal(floorFigure(40), 30, "equal to the step: « more than 40 » would be false");
  assert.equal(floorFigure(11), 10);
  assert.equal(floorFigure(6), 5);
  assert.equal(floorFigure(120), 100);
  assert.equal(floorFigure(1234), 1000);
  assert.equal(floorFigure(170578), 150000);
  assert.equal(floorFigure(4968), 4500);
});

test("floorFigure never exceeds the real count and hides what it cannot say", () => {
  for (let n = 0; n < 3000; n++)
    assert.ok(floorFigure(n) <= n && (n === 0 || floorFigure(n) < n || floorFigure(n) === 0), String(n));
  assert.equal(floorFigure(5), 0);
  assert.equal(floorFigure(0), 0);
  assert.equal(floorFigure(Number.NaN), 0);
});
