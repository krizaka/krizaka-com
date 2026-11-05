import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

test("the story's film poster is a taped photo, while the existing lightbox trigger stays interactive", () => {
  const story = read("app/[locale]/story/page.tsx");
  assert.match(story, /from "@krizaka\/ui\/taped-photo"/);
  assert.match(story, /<TapedPhoto className="st-film-photo" tilt=\{lean\("who"\)\}>\s*<FilmLightbox/);
  assert.match(story, /trigger=\{\s*<button type="button" className="st-film"/);
  assert.match(read("app/[locale]/story/story.css"), /\.st-film:focus-visible\s*\{[^}]*outline-offset:\s*-3px/);
});
