/* The pure part of scripts/check-docs-hub.mjs: what the docs hub must show and how a reading of it is judged. Founder,
   2026-11-06 (krizaka-internal#2799): « quelque chose d'autre que des cards » — the hub is the notebook's sommaire, one
   row per path of lib/docs-start.ts, and nothing is cut at the right edge of his screen (1470 px). Tested by
   tests/docs-hub-check.test.mjs. */

import { THEMES } from "./overflow-lib.mjs";

/** A phone, a tablet, a laptop and the founder's screen. */
export const HUB_WIDTHS = [375, 768, 1280, 1470];
export const HUB_PATHS = ["/fr/docs", "/en/docs"];

/** Every hub page × width × theme to read. */
export function hubCases(paths = HUB_PATHS, widths = HUB_WIDTHS, themes = THEMES) {
  return paths.flatMap((path) => widths.flatMap((width) => themes.map((theme) => ({ path, width, theme }))));
}

/** The rows the hub must show, in order: `§ n`, the title's address in the reader's language, every link's address. */
export function expectedRows(paths, locale) {
  return paths.map((p, i) => ({
    id: p.id,
    number: `§ ${i + 1}`,
    href: p.href.startsWith("/#") ? `/${locale}${p.href.slice(1)}` : p.href,
    links: p.links.map((l) => l.href),
  }));
}

/**
 * The failure lines of one reading (`[]` when the hub is right). `seen`: `found` (the sommaire is on the page), `cards`
 * (how many card-grid items are left), `rows` (`{ number, href, line, links }` as the browser read them) and `boxed`
 * (the elements of the sommaire that draw a border, a shadow, a radius or a filled link: a card or a pill).
 */
export function hubProblems({ path, width, theme }, seen, expected) {
  const at = `${path} at ${width}px (${theme})`;
  if (!seen.found) {
    return [`${at}: no sommaire (.kz-contents) in the « start here » section`];
  }
  const problems = [];
  if (seen.cards > 0) {
    problems.push(`${at}: ${seen.cards} card(s) left in the hub`);
  }
  if (seen.rows.length !== expected.length) {
    problems.push(`${at}: ${seen.rows.length} row(s), expected ${expected.length}`);
  }
  expected.forEach((want, i) => {
    const row = seen.rows[i];
    if (!row) {
      return;
    }
    if (row.number !== want.number) {
      problems.push(`${at}: row ${i + 1}: number « ${row.number} », expected « ${want.number} »`);
    }
    if (row.href !== want.href) {
      problems.push(`${at}: ${want.number} links ${row.href}, expected ${want.href}`);
    }
    if (!row.line) {
      problems.push(`${at}: ${want.number} has no line saying who it is for`);
    }
    const missing = want.links.filter((href) => !row.links.includes(href));
    if (missing.length) {
      problems.push(`${at}: ${want.number} misses ${missing.join(", ")}`);
    }
  });
  if (seen.boxed.length) {
    problems.push(`${at}: draws a box — ${seen.boxed.slice(0, 4).join(", ")}`);
  }
  return problems;
}
