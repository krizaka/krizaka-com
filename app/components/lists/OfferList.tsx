/* The offer as a list, not three squares (founder, 2026-11-05, krizaka-internal#2450): Krizaka Entreprise's three parts,
   numbered like a notebook's entries (« 01 »), each its name in the display face, its line in the typewriter's, its one
   sentence, and on /services what it covers, in two columns on a wide screen, one on a phone. The home's version is
   compact (number, name, sentence) and each entry leads to its part on /services. A server component; tokens only. The
   @krizaka/ui catalogue has no numbered-list block yet (noted for krizaka-ui): this is the small page set AGENTS.md §4.1
   leaves to the site. */

import { ForwardIcon } from "@krizaka/icons";
import Link from "next/link";
import type { ReactNode } from "react";
import "./lists.css";

export interface OfferItem {
  id: string;
  name: string;
  /** A short note under the name (typewriter face). */
  meta?: string;
  /** The one sentence it is about. */
  hook: string;
  /** What it covers, on the full list. */
  points?: readonly string[];
  /** Where the entry leads (compact list): the whole entry is one link. */
  href?: string;
}

const two = (n: number) => String(n).padStart(2, "0");

export function OfferList({
  items,
  label,
  pointsLabel,
  compact = false,
  footer,
}: Readonly<{
  items: readonly OfferItem[];
  label: string;
  /** The accessible name of each entry's list of points. */
  pointsLabel?: string;
  compact?: boolean;
  footer?: ReactNode;
}>) {
  return (
    <div className="kz-offers" data-compact={compact ? "" : undefined}>
      <ol className="kz-offers-list" aria-label={label}>
        {items.map((o, i) => {
          const head = (
            <>
              <span className="kz-offers-n" aria-hidden>
                {two(i + 1)}
              </span>
              <span className="kz-offers-head">
                <h3 className="kz-offers-name">{o.name}</h3>
                {o.meta && <span className="kz-offers-meta">{o.meta}</span>}
              </span>
              <p className="kz-offers-hook">{o.hook}</p>
            </>
          );
          return (
            <li key={o.id} id={compact ? undefined : `offer-${o.id}`} className="kz-offers-item">
              {o.href ? (
                <Link href={o.href} className="kz-offers-link">
                  {head}
                  <ForwardIcon size={16} aria-hidden className="kz-offers-arrow" />
                </Link>
              ) : (
                <div className="kz-offers-link">{head}</div>
              )}
              {!compact && o.points && (
                <ul className="kz-offers-points" aria-label={pointsLabel ? `${pointsLabel} · ${o.name}` : undefined}>
                  {o.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
      {footer && <div className="kz-offers-foot">{footer}</div>}
    </div>
  );
}
