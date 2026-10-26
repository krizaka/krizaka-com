/* One chapter of /story, readable in ten seconds: its number and status, a heading, one or two lines, the bird that
   carries its promise, ONE proof visual, the way in — and the depth behind a native fold (<details>), never on the face.
   The same shell for every chapter (who we are, the engine, each product, the open stack, what is next); a product
   chapter wears its brand (`.brand-<id>`). A server component. */

import type { ReactNode } from "react";
import { Mascot } from "@krizaka/ui/mascots";
import type { StoryBird } from "@/lib/story";

export interface ChapterFold {
  summary: string;
  children: ReactNode;
}

/** Which side the chapter's picture or video sits on, down the page: the first on the right, the second on the left, and so on
 *  (a story read top to bottom). On a phone every chapter is one column and the CSS ignores the side. */
export const sideOf = (number: number): "right" | "left" => (number % 2 ? "right" : "left");

const digits = (n: number) => String(n).padStart(2, "0");

export default function StoryChapter({
  id,
  number,
  chapterLabel,
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
  /** « Chapter 03 », read by screen readers before the heading. */
  chapterLabel: string;
  brand?: string;
  /** Beside the number: a status chip, a place. */
  meta?: ReactNode;
  title: ReactNode;
  /** A mono line under the title: what the subject is (« Reading documents »). */
  kicker?: string;
  lead: ReactNode;
  bird?: StoryBird;
  promise?: string;
  proof?: ReactNode;
  fold?: ChapterFold;
  actions?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={"st-ch" + (brand ? " brand-" + brand : "")} data-chapter={id} data-side={sideOf(number)}>
      <div className="st-ch-grid">
        <div className="st-ch-text">
          <p className="st-ch-meta">
            <span className="st-ch-n">
              <span className="sr-only">{chapterLabel}</span>
              <span aria-hidden>{digits(number)}</span>
            </span>
            {meta}
          </p>
          <h2 id={`${id}-title`} className="st-ch-title">
            {title}
          </h2>
          {kicker && <p className="st-ch-kicker">{kicker}</p>}
          <div className="st-ch-lead">{lead}</div>
          {bird && promise && (
            <p className="st-ch-promise">
              <Mascot bird={bird} mood="success" tone="own" size={44} animated={false} />
              <span>{promise}</span>
            </p>
          )}
          {actions && <div className="st-ch-actions">{actions}</div>}
        </div>
        {proof && <div className="st-ch-proof">{proof}</div>}
      </div>
      {fold && (
        <details className="st-ch-fold">
          <summary>{fold.summary}</summary>
          <div className="st-ch-fold-body">{fold.children}</div>
        </details>
      )}
    </section>
  );
}
