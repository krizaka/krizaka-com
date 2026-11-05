/* Public work as a ledger (founder, 2026-11-05, krizaka-internal#2450: « classier, not plain boxes »): one row per
   artefact — its mark, its name in the display face, one sentence, and the way out at the right edge — on hairlines, two
   columns on a wide screen, one on a phone. Each row is one link (a new tab: it leaves the site). Under the pointer the
   row's paper goes one step up; nothing moves. A server component; tokens only. */

import { ExternalIcon } from "@krizaka/icons";
import type { ReactNode } from "react";
import "./lists.css";

export interface LedgerItem {
  id: string;
  href: string;
  icon: ReactNode;
  title: string;
  line: string;
}

export function WorkLedger({
  items,
  label,
  cta,
}: Readonly<{ items: readonly LedgerItem[]; label: string; cta: string }>) {
  return (
    <ul className="kz-ledger" aria-label={label}>
      {items.map((it) => (
        <li key={it.id}>
          <a href={it.href} target="_blank" rel="noopener" className="kz-ledger-row">
            <span className="kz-ledger-icon" aria-hidden>
              {it.icon}
            </span>
            <span className="kz-ledger-words">
              <span className="kz-ledger-title">{it.title}</span>
              <span className="kz-ledger-line">{it.line}</span>
            </span>
            <span className="kz-ledger-cta">
              {cta} <ExternalIcon size={14} aria-hidden />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
