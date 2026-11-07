/* The share image of a page (founder, 2026-11-07, krizaka-internal#2833): one per page, generated at build by Next's
   `ImageResponse` from the page's own section and title, in the Cahier — paper and blue ink, the Seyès ruling, the red margin
   where the § hangs, Young Serif for the title (one weight), Courier Prime for the notes. No gradient, no glow, square corners.
   The colours are @krizaka/tokens' light theme (paper), the faces @krizaka/fonts' files: nothing is typed or copied here.
   Each route's `opengraph-image.tsx` calls `shareImage` with its words (lib/og-pages.ts). */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { themes } from "@krizaka/tokens/native";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const paper = themes.light;
// The faces' files, read from the project root as Next's own guide does (opengraph-image, « Using a local font »). Each call
// holds its whole path, so the standalone build traces these three files and nothing else.
const faces = () =>
  Promise.all([
    readFile(join(process.cwd(), "node_modules/@krizaka/fonts/files/native/YoungSerif-Regular.ttf")),
    readFile(join(process.cwd(), "node_modules/@krizaka/fonts/files/native/CourierPrime-Regular.ttf")),
    readFile(join(process.cwd(), "node_modules/@krizaka/fonts/files/native/AtkinsonHyperlegibleNext-Regular.ttf")),
  ]);

/** The words of one card: the section (a lower-case note beside the §), the title, and the address line. */
export interface ShareCard {
  section: string;
  title: string;
  /** `www.krizaka.com/fr/docs`: where the page lives, as it reads in a note. */
  address: string;
}

// @fixed: the Seyès ruling of the card, a fact of the drawing (one minor line every 24 px, the margin at 168 px).
const RULE_STEP = 24;
// @fixed: where the red margin stands on the card.
const MARGIN_X = 168;

/** Rich messages carry `<b>…</b>`: the card draws plain words. */
export const plainWords = (text: string) =>
  text
    .replace(/<\/?b>/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** The title's size: a long title steps down so it holds in three lines (the first step its length fits under). */
const TITLE_STEPS = [
  { upTo: 40, size: 80 },
  { upTo: 70, size: 68 },
  { upTo: Infinity, size: 56 },
] as const;
export const titleSize = (title: string) => TITLE_STEPS.find((s) => title.length <= s.upTo)?.size ?? 56;

export async function shareImage(card: ShareCard): Promise<ImageResponse> {
  const [display, note, text] = await faces();
  const rules = Array.from({ length: Math.floor(OG_SIZE.height / RULE_STEP) }, (_, i) => (i + 1) * RULE_STEP);
  const title = plainWords(card.title);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: paper.surface0,
        color: paper.textPrimary,
        fontFamily: "Atkinson",
      }}
    >
      {rules.map((y) => (
        <div
          key={y}
          style={{ position: "absolute", left: 0, right: 0, top: y, height: 1, background: paper.paperRuleMinor }}
        />
      ))}
      <div
        style={{ position: "absolute", top: 0, bottom: 0, left: MARGIN_X, width: 2, background: paper.paperRuleMargin }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: MARGIN_X - 24,
          top: 96,
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: "Courier",
          fontSize: 44,
          color: paper.paperRuleMargin,
        }}
      >
        §
      </div>
      <div
        style={{
          position: "absolute",
          left: MARGIN_X + 48,
          right: 72,
          top: 104,
          bottom: 72,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Courier", fontSize: 28, color: paper.paperRuleMargin }}>
          {card.section.toLowerCase()}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "Young Serif",
            fontSize: titleSize(title),
            lineHeight: 1.12,
            color: paper.textPrimary,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            fontFamily: "Courier",
            fontSize: 24,
            color: paper.textSecondary,
          }}
        >
          <span>Krizaka · Montréal</span>
          <span>{card.address}</span>
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Young Serif", data: display, style: "normal", weight: 400 },
        { name: "Courier", data: note, style: "normal", weight: 400 },
        { name: "Atkinson", data: text, style: "normal", weight: 400 },
      ],
    },
  );
}
