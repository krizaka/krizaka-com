import { test } from "node:test";
import assert from "node:assert/strict";
import { expectedRows, HUB_WIDTHS, hubCases, hubProblems } from "../scripts/docs-hub-lib.mjs";
import { START_PATHS } from "../lib/docs-start.ts";

// Founder, 2026-11-06 (krizaka-internal#2799): the hub is the notebook's sommaire, not cards, and nothing is cut at the
// right edge (his screen: 1470 px). scripts/check-docs-hub.mjs reads /docs in a real browser; the rules are pure, here.
const c = { path: "/fr/docs", width: 1470, theme: "light" };
const good = () => ({
  found: true,
  cards: 0,
  rows: expectedRows(START_PATHS, "fr").map((r) => ({ ...r, line: "Pour qui…" })),
  boxed: [],
});

test("the hub is read at a phone, a tablet, a laptop and the founder's screen, in both languages and themes", () => {
  assert.deepEqual(HUB_WIDTHS, [375, 768, 1280, 1470]);
  const all = hubCases();
  assert.equal(all.length, 2 * 4 * 2);
  assert.ok(all.some((x) => x.path === "/en/docs" && x.width === 375 && x.theme === "dark"));
  assert.ok(all.some((x) => x.path === "/fr/docs" && x.width === 1470 && x.theme === "light"));
});

test("the rows to see are the paths of lib/docs-start.ts: § n, the title's address in the reader's language, every link", () => {
  const rows = expectedRows(START_PATHS, "fr");
  assert.deepEqual(
    rows.map((r) => r.number),
    ["§ 1", "§ 2", "§ 3", "§ 4"],
  );
  assert.equal(rows.find((r) => r.id === "products").href, "/fr#products");
  for (const [i, p] of START_PATHS.entries())
    assert.deepEqual(
      rows[i].links,
      p.links.map((l) => l.href),
    );
});

test("a sommaire with every row, number, line and link, and no box, is clean", () => {
  assert.deepEqual(hubProblems(c, good(), expectedRows(START_PATHS, "fr")), []);
});

test("cards, a missing sommaire, a lost link, a wrong number or a box are failures that say where", () => {
  const expected = expectedRows(START_PATHS, "fr");
  assert.match(hubProblems(c, { found: false, cards: 0, rows: [], boxed: [] }, expected)[0], /no sommaire/);
  assert.match(hubProblems(c, { ...good(), cards: 4 }, expected).join("\n"), /4 card\(s\)/);

  const lost = good();
  lost.rows[0].links = lost.rows[0].links.slice(1);
  assert.match(hubProblems(c, lost, expected).join("\n"), /§ 1 .*misses .*installation/);

  const renumbered = good();
  renumbered.rows[1].number = "§ 3";
  assert.match(hubProblems(c, renumbered, expected).join("\n"), /row 2: number « § 3 », expected « § 2 »/);

  const silent = good();
  silent.rows[2].line = "";
  assert.match(hubProblems(c, silent, expected).join("\n"), /§ 3 .*no line/);

  const short = good();
  short.rows.pop();
  assert.match(hubProblems(c, short, expected).join("\n"), /3 row\(s\), expected 4/);

  assert.match(
    hubProblems(c, { ...good(), boxed: ["a (border)", "li (box-shadow)"] }, expected).join("\n"),
    /\/fr\/docs at 1470px \(light\): draws a box — a \(border\), li \(box-shadow\)/,
  );
});
