/* One chapter of /story, readable in ten seconds: the site's section head (@krizaka/ui SectionHeading: « § n » in the
   margin, a lower-case note, the title), one or two lines, the bird that carries its promise, ONE figure — the chapter's
   clip when it has one (lib/story-clips.ts) — the way in, and the depth behind a native fold (the /services questions'
   `.kz-tpl-faq`), never on the face. The same shell for every chapter; a product chapter scopes its brand to what wears
   it (its status chip and its actions), as the home's product tags do, so the Cahier faces and the margin ink stay the
   page's. A server component. */

import type { ReactNode } from "react";
import { cn } from "@krizaka/ui/cn";
import { Mascot } from "@krizaka/ui/mascots";
import { SectionHeading } from "@krizaka/ui/page";
import type { StoryBird } from "@/lib/story";

export interface ChapterFold {
  summary: string;
  children: ReactNode;
}

/** Which side the chapter's figure sits on, down the page: the first on the right, the second on the left, and so on
 *  (a story read top to bottom). On a narrow screen every chapter is one column and the CSS ignores the side. */
export const sideOf = (number: number): "right" | "left" => (number % 2 ? "right" : "left");

export default function StoryChapter({
  id,
  number,
  brand,
  meta,
  title,
  kicker,
  lead,
  bird,
  promise,
  proof,
  fold,
  actions,
}: {
  id: string;
  number: number;
  /** The product the chapter is about: its status chip and its actions wear its brand. */
  brand?: string;
  /** After the note: a status chip. */
  meta?: ReactNode;
  title: ReactNode;
  /** The note above the title, lower case: what the subject is (« Reading documents »), or where (« Montréal »). */
  kicker?: string;
  lead: ReactNode;
  bird?: StoryBird;
  promise?: string;
  proof?: ReactNode;
  fold?: ChapterFold;
  actions?: ReactNode;
}) {
  const branded = brand ? `brand-${brand}` : undefined;
  const note =
    kicker || meta ? (
      <>
        {kicker}
        {meta && <span className={branded}>{meta}</span>}
      </>
    ) : undefined;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="st-ch" data-chapter={id} data-side={sideOf(number)}>
      <div className="st-ch-grid">
        <div className="st-ch-text">
          <SectionHeading id={`${id}-title`} number={`§ ${number}`} eyebrow={note} title={title} size="sm" />
          <div className="rd-prose st-ch-lead">{lead}</div>
          {bird && promise && (
            <p className="st-ch-promise">
              <Mascot bird={bird} mood="success" tone="own" size={44} animated={false} />
              <span>{promise}</span>
            </p>
          )}
          {actions && <div className={cn("st-ch-actions", branded)}>{actions}</div>}
        </div>
        {proof && <div className="st-ch-proof">{proof}</div>}
      </div>
      {fold && (
        <div className="kz-tpl-faq st-ch-fold">
          <details>
            <summary>{fold.summary}</summary>
            <div className="st-ch-fold-body">{fold.children}</div>
          </details>
        </div>
      )}
    </section>
  );
}
