import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ROWS, cases, homeStackProblems } from "../scripts/home-stack-lib.mjs";

// The home's stack section is one row per publication (krizaka-com#392): a visual of one fixed height and a specimen tag,
// alternating on a wide screen, one column on a phone. scripts/check-home-stack.mjs reads it in a browser; the rule is here.
const rect = (left, width, top, height) => ({ left, right: left + width, top, bottom: top + height, height });
const wide = (i, id) => ({
  id,
  visual: i % 2 === 0 ? rect(100, 700, 100 + i * 400, 320) : rect(600, 700, 100 + i * 400, 320),
  tag: i % 2 === 0 ? rect(824, 500, 100 + i * 400, 300) : rect(100, 500, 100 + i * 400, 300),
  code: `KZ-L0${i + 1}`,
  site: ["ui", "motion", "java", "ts"][i] + ".krizaka.com",
  actions: 2,
});
const narrow = (i, id) => ({ ...wide(i, id), visual: rect(16, 358, 100 + i * 700, 320), tag: rect(16, 358, 440 + i * 700, 300) });
const IDS = ["ui", "motion", "java", "ts"];
const ok = (make) => ({ rows: IDS.map((id, i) => make(i, id)), viewport: 1440, code: 0, controls: 0 });
const desktop = { path: "/en", width: 1440, theme: "dark" };
const phone = { path: "/fr", width: 390, theme: "light" };
const phoneOk = () => ({ ...ok(narrow), viewport: 390 });

test("the cases: the home in both languages, a phone and a desktop, dark and light", () => {
  const all = cases();
  assert.equal(all.length, 2 * 2 * 2);
  assert.deepEqual(all[0], { path: "/en", width: 390, theme: "dark" });
  assert.ok(all.some((c) => c.path === "/fr" && c.width === 1440 && c.theme === "light"));
});

test("rows that alternate on a desktop and stack on a phone pass; a missing section is one problem", () => {
  assert.deepEqual(homeStackProblems(desktop, ok(wide)), []);
  assert.deepEqual(homeStackProblems(phone, phoneOk()), []);
  assert.deepEqual(homeStackProblems(desktop, null), ["/en at 1440px (dark): no #stack section"]);
});

test("a live control or a code element outside an inert picture is refused: they live on /open-source", () => {
  assert.match(homeStackProblems(desktop, { ...ok(wide), code: 2 }).join("\n"), /2 code element\(s\).*\/open-source/);
  assert.match(homeStackProblems(desktop, { ...ok(wide), controls: 6 }).join("\n"), /6 live control\(s\).*playground controls live on \/open-source/);
});

test("one row per publication: the count follows the list, the codes are the library series in order", () => {
  assert.equal(ROWS, 4);
  const three = ok(wide);
  three.rows.pop();
  assert.match(homeStackProblems(desktop, three).join("\n"), /3 rows, expected 4/);
  assert.deepEqual(homeStackProblems(desktop, three, 3), [], "the expected count is a parameter");
  const miscoded = ok(wide);
  miscoded.rows[1] = { ...miscoded.rows[1], code: "KZ-02" };
  assert.match(homeStackProblems(desktop, miscoded).join("\n"), /row 2 \(motion\) is coded "KZ-02", expected KZ-L02/);
  const noTag = ok(wide);
  noTag.rows[2] = { ...noTag.rows[2], tag: null };
  assert.match(homeStackProblems(desktop, noTag).join("\n"), /row 3 \(java\) has no specimen tag/);
});

test("the visuals share one fixed height", () => {
  const uneven = ok(wide);
  uneven.rows[1] = { ...uneven.rows[1], visual: { ...uneven.rows[1].visual, height: 360, bottom: uneven.rows[1].visual.top + 360 } };
  assert.match(homeStackProblems(desktop, uneven).join("\n"), /the visuals differ in height \(320, 360, 320, 320px\)/);
});

test("the rows alternate on a wide screen and the tag goes under its visual on a phone", () => {
  const same = ok(wide);
  same.rows[1] = wide(0, "motion");
  same.rows[1].code = "KZ-L02";
  assert.match(homeStackProblems(desktop, same).join("\n"), /row 2 \(motion\) does not alternate \(the visual should be on the right\)/);
  const stacked = ok(wide);
  stacked.rows[0] = { ...stacked.rows[0], tag: rect(100, 500, 460, 300) };
  assert.match(homeStackProblems(desktop, stacked).join("\n"), /row 1 \(ui\): the tag is not beside its visual/);
  const beside = phoneOk();
  beside.rows[0] = { ...beside.rows[0], tag: rect(16, 100, 100, 300) };
  assert.match(homeStackProblems(phone, beside).join("\n"), /on a phone the tag goes under its visual/);
});

test("each tag names a site host and carries its two actions; nothing overflows the screen", () => {
  for (const site of ["https://ui.krizaka.com", "ui.krizaka.com/", "Krizaka UI", "krizaka.github.io/krizaka-motion"]) {
    const bad = ok(wide);
    bad.rows[0] = { ...bad.rows[0], site };
    assert.match(homeStackProblems(desktop, bad).join("\n"), /row 1 \(ui\) names ".*", not a site address/, site);
  }
  const lone = ok(wide);
  lone.rows[3] = { ...lone.rows[3], actions: 1 };
  assert.match(homeStackProblems(desktop, lone).join("\n"), /row 4 \(ts\) has 1 action\(s\), expected 2/);
  const wideTag = phoneOk();
  wideTag.rows[0] = { ...wideTag.rows[0], tag: rect(16, 500, 440, 300) };
  assert.match(homeStackProblems(phone, wideTag).join("\n"), /row 1 \(ui\) overflows the screen/);
});

test("the container smoke runs the check on the real image", () => {
  assert.match(readFileSync(new URL("../scripts/ci-container-smoke.sh", import.meta.url), "utf8"), /node scripts\/check-home-stack\.mjs --base http:\/\/localhost:3000/);
});
