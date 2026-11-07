/* A release line is written in the repositories' words (a retired code name, once); the page says the commercial names
   (krizaka-internal#2103), in prose and in hosts (`dev.<name>.com` → the commercial dev host). A reference to a repository of
   the org (`krizaka/<name>#478`, `github.com/krizaka/<name>`) says its current name: the repositories were renamed and GitHub
   redirects the old path (krizaka-internal#2836: a build whose sources timed out failed on `krizaka/akinaza#478`). A package
   or a longer identifier (`@krizaka/<name>-cli`, `<name>-edge`) keeps its published name: npm answers to it. */

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

/** A repository of the org: `krizaka/<name>` not preceded by `@` (a package) and not followed by more of an identifier. */
const REPOSITORY = new RegExp(String.raw`(?<![\w@.-])(krizaka/)(${NAMES})(?![\w-])`, "gi");

/** `text` with every code name said as its commercial name, and every renamed repository by its current name. */
export const commercialWords = (text: string): string =>
  text
    .replace(REPOSITORY, (_, owner: string, name: string) => owner + MAP[name.toLowerCase()].toLowerCase())
    .replace(WORD, said);
