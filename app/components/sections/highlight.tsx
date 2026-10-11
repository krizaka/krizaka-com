import type { ReactNode } from "react";

/* A small, server-side highlighter for the samples of the page language: comments, strings, annotations, XML tags and
   keywords — no highlighter in the bundle, no colour outside the tokens (sections.css `.ps-tk-*`, each ≥ 4.5:1 on the
   code surface in both themes). It colours what helps reading a sample; it is not a parser. */

const CLASS = { comment: "ps-tk-comment", string: "ps-tk-string", annotation: "ps-tk-annotation", tag: "ps-tk-tag", keyword: "ps-tk-keyword" } as const;

const KEYWORDS =
  "public|private|protected|final|static|class|interface|record|extends|implements|return|new|try|catch|throw|throws|if|else|void|import|from|export|function|const|let|var|val|fun|true|false|null|this|default";

const TOKEN = new RegExp(
  [
    String.raw`(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|(?:^|(?<=\n))[ \t]*#[^\n]*)`,
    String.raw`(?<string>"(?:[^"\\\n]|\\.)*"|\x60(?:[^\x60\\]|\\.)*\x60)`,
    String.raw`(?<annotation>@[A-Za-z][\w.]*)`,
    String.raw`(?<tag><\/?[A-Za-z][\w.:-]*|\/?>)`,
    String.raw`(?<keyword>\b(?:${KEYWORDS})\b)`,
  ].join("|"),
  "g",
);

export function highlight(code: string, lang: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    const kind = Object.entries(m.groups ?? {}).find(([, v]) => v !== undefined)?.[0] as keyof typeof CLASS | undefined;
    if (!kind || (kind === "tag" && lang !== "xml") || (kind === "comment" && m[0].trimStart().startsWith("#") && lang === "css")) continue;
    if (m.index > last) out.push(code.slice(last, m.index));
    out.push(
      <span key={m.index} className={CLASS[kind]}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}
