/* The notebook's sommaire (founder, 2026-11-06, krizaka-internal#2799: « quelque chose d'autre que des cards »): one entry
   per row on the Seyès lines, its number (« § 1 ») in the red margin, its title in the display face as the link, one line
   saying who it is for, then its first pages as plain inline links, a quiet note after a link when it has one (a
   product's status). No box, no border, no pill: the ruling and the type carry the hierarchy, one column at every width.
   The ruling and the margin are @krizaka/ui's own (`data-paper="lines"`, `data-margin`). @krizaka/ui has no contents block
   with sub-links yet (`ChapterIndex` makes the whole row one link, `DocsHubPage` draws cards): noted on
   krizaka-internal#2799 for krizaka-ui, the site moves to it then. A server component; tokens only. */

import Link from "next/link";
import "./lists.css";

export interface ContentsLink {
  href: string;
  label: string;
  /** A quiet word after the link, in the typewriter face (a product's status). */
  note?: string;
}

export interface ContentsEntry {
  id: string;
  /** Its number in the margin: `§ 1`. */
  number: string;
  title: string;
  /** Where the title leads. */
  href: string;
  /** One short line: who it is for. */
  line: string;
  links: readonly ContentsLink[];
}

export function ContentsIndex({ entries, label }: Readonly<{ entries: readonly ContentsEntry[]; label: string }>) {
  return (
    <ol className="kz-contents" data-paper="lines" data-margin="" aria-label={label}>
      {entries.map((e) => (
        <li key={e.id} className="kz-contents-row">
          <span className="kz-contents-no" aria-hidden>
            {e.number}
          </span>
          <h3 className="kz-contents-title" id={`contents-${e.id}`}>
            <Link href={e.href}>{e.title}</Link>
          </h3>
          <p className="kz-contents-line">{e.line}</p>
          <ul className="kz-contents-links" aria-labelledby={`contents-${e.id}`}>
            {e.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
                {l.note && (
                  <>
                    {" "}
                    <span className="kz-contents-note">{l.note}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
