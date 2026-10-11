"use client";

import type { ReactNode } from "react";
import { Tooltip } from "@krizaka/ui/tooltip";

/** Secondary actions as icon buttons (discuss · propose · report): the words are the accessible name and a tooltip on
    hover and focus (@krizaka/ui/tooltip). */
export default function IconActions({ links, label }: { links: readonly { href: string; label: string; icon: ReactNode }[]; label?: string }) {
  return (
    <ul className="ps-icon-actions" aria-label={label}>
      {links.map((l) => (
        <li key={l.href}>
          <Tooltip content={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="ps-icon-btn" aria-label={l.label}>
              {l.icon}
            </a>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
}
