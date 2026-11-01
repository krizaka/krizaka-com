/* A release line is written in the repositories' words (« Orazaka », « Yomizaka »); the page says the commercial names
   (krizaka-internal#2103). Names inside an address, a repository or a package (`orazaka-edge`, `dev.yomizaka.com`) stay. */

import { codeNameMap } from "@krizaka/org";

const MAP = codeNameMap();
const WORD = new RegExp(
  String.raw`(?<![\w./@:#-])(${Object.keys(MAP).join("|")})(?![\w-]|\.(?:com|app|shop|dev)\b)`,
  "gi",
);

/** `text` with every code name said as its commercial name. */
export const commercialWords = (text: string): string => text.replace(WORD, (w) => MAP[w.toLowerCase()] ?? w);
