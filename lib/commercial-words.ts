/* A release line is written in the repositories' words (a retired code name, once); the page says the commercial names
   (krizaka-internal#2103), in prose and in hosts (`dev.<name>.com` → the commercial dev host). A name that is part of a
   repository path, a package or a longer identifier (`<name>-edge`, `github.com/krizaka/<name>`, `@krizaka/<name>-cli`) is
   history's own address and stays: GitHub and npm answer to it. */

import { codeNameMap } from "@krizaka/org";

const MAP = codeNameMap();
const NAMES = Object.keys(MAP).join("|");
/** Not inside a path or a longer identifier: nothing word-like, `/`, `@` or `-` before, nothing word-like or `-` after. */
const WORD = new RegExp(String.raw`(?<![\w/@-])(${NAMES})(?![\w-])`, "gi");

/** The commercial name in the case the code name was written in (a lowercase id stays lowercase, a capitalised name stays capitalised). */
const said = (word: string): string => {
  const name = MAP[word.toLowerCase()] ?? word;
  return word === word.toLowerCase() ? name.toLowerCase() : name;
};

/** `text` with every code name said as its commercial name. */
export const commercialWords = (text: string): string => text.replace(WORD, said);
