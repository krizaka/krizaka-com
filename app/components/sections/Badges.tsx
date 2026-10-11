import Link from "next/link";
import { cn } from "@krizaka/ui/cn";

export interface Badge {
  label: string;
  /** `ok` — published, usable today; `wip` — work in progress, said honestly; `neutral` — a fact. */
  tone?: "ok" | "wip" | "neutral";
  href?: string;
}

const TONE = { ok: "is-ok", wip: "is-wip", neutral: "is-neutral" } as const;

/** Compact facts on one line (registry and version, status): a dot that says the state, a few mono words. */
export default function Badges({ items, label }: { items: readonly Badge[]; label?: string }) {
  return (
    <ul className="ps-badges" aria-label={label}>
      {items.map((b) => {
        const body = (
          <>
            <span className="ps-badge-dot" aria-hidden /> {b.label}
          </>
        );
        const cls = cn("ps-badge", TONE[b.tone ?? "neutral"]);
        return (
          <li key={b.label}>
            {!b.href ? (
              <span className={cls}>{body}</span>
            ) : b.href.startsWith("/") || b.href.startsWith("#") ? (
              <Link href={b.href} className={cls}>
                {body}
              </Link>
            ) : (
              <a href={b.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {body}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
