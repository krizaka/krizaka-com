import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

// 2026-11-06 (krizaka-internal#2800): the story's film is no longer a taped poster; its loop is chapter 1's clip and the
// whole film opens from a @krizaka/ui Button (AGENTS §4: every action is the Button, no page-local button class).
test("the story's film opens from the site's Button under chapter 1's clip, never from a hand-made button or a taped print", () => {
  const story = read("app/[locale]/story/page.tsx");
  assert.doesNotMatch(story, /@krizaka\/ui\/taped-photo|<TapedPhoto/);
  assert.match(story, /from "@krizaka\/ui\/button"/);
  assert.match(story, /<FilmLightbox[\s\S]*?trigger=\{\s*<Button type="button" variant="secondary" size="md">/);
  assert.doesNotMatch(story, /<button type="button" className="st-film"/);
  assert.doesNotMatch(read("app/[locale]/story/story.css"), /\.st-film(\s|:|\{)/);
});
