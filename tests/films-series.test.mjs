import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FILMS_SERIES, SeriesStatus, seriesHref, youtubeWatchUrl } from "../lib/films-series.ts";
import { WATCH_FILMS, watchFilm, watchPath } from "../lib/watch-films.ts";
import { NAV_BAR_LINKS } from "../lib/nav.ts";
import { orphanFilms } from "../scripts/check-films-linked.mjs";

const root = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p), "utf8");

test("the founder's films are a series in order: 1 Montrer son travail, 2 Notre histoire, 3 to come (#3909)", () => {
  assert.deepEqual(
    FILMS_SERIES.map((e) => e.id),
    ["montrer-son-travail", "notre-histoire", "next"],
  );
  const published = FILMS_SERIES.filter((e) => e.status === SeriesStatus.Published);
  assert.equal(published.length, 2);
  const dates = published.map((e) => e.date);
  assert.deepEqual(dates, [...dates].sort(), "published films are in date order");
  assert.deepEqual(dates, ["2026-11-01", "2026-11-13"]);
  // The to-come entries come last.
  const firstUpcoming = FILMS_SERIES.findIndex((e) => e.status === SeriesStatus.Upcoming);
  assert.ok(FILMS_SERIES.slice(firstUpcoming).every((e) => e.status === SeriesStatus.Upcoming));
});

test("a published entry has a date and a reachable link; a to-come entry has neither", () => {
  for (const e of FILMS_SERIES) {
    if (e.status === SeriesStatus.Published) {
      assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/, e.id);
      const href = seriesHref(e, "fr");
      assert.ok(href, e.id);
      if (e.watchId) {
        assert.equal(href, `/fr${watchPath(e.watchId)}`);
        assert.ok(watchFilm(e.watchId), `${e.id}: its watch page exists`);
      } else {
        assert.match(href, /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/, e.id);
      }
    } else {
      assert.equal(e.date, undefined, e.id);
      assert.equal(seriesHref(e, "fr"), undefined, e.id);
    }
  }
});

test("the YouTube address comes from the org's links, not from a component", () => {
  assert.equal(youtubeWatchUrl("8Ctg73JPT1M"), "https://www.youtube.com/watch?v=8Ctg73JPT1M");
  assert.doesNotMatch(read("app/components/FilmsTimeline.tsx"), /youtube/i);
  assert.match(read("lib/films-series.ts"), /@krizaka\/org/);
});

test("the series has its words in both languages", () => {
  for (const l of ["en", "fr"]) {
    const s = JSON.parse(read(`messages/${l}.json`)).site.story.watch.series;
    for (const k of ["heading", "lead", "here", "soon", "others"]) assert.ok(s[k].trim(), `${l} ${k}`);
    for (const e of FILMS_SERIES) assert.ok(s.items[e.id].title.trim(), `${l} ${e.id}`);
  }
});

test("every watch page is linked from the header or a page body, not only the footer (#3909)", () => {
  assert.ok(
    NAV_BAR_LINKS.some((l) => l.href.startsWith("/films/")),
    "the bar has a Films entry",
  );
  assert.deepEqual(orphanFilms(), []);
  assert.deepEqual(
    orphanFilms({ withoutNav: true, withoutBody: true }).sort(),
    WATCH_FILMS.map((f) => f.id).sort(),
    "the check does fail when nothing links them",
  );
});
