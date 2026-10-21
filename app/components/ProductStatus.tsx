/* A product's status (lib/nav.ts, ProductStatus), one compact treatment everywhere — the Products panel, the mobile
   panel, the footer, the home: never a second line, never a wrap.

   - `chip`: a small dot and the short label, mono, on one line (`white-space: nowrap`) — beside a name or a heading.
   - `dot`: the dot alone, for the tightest places (the panel's product column), its long label read by screen readers.

   `upcoming` and `devPreview` light a full dot in the brand accent; `development` a half-lit ring (built in the open, in development);
   `construction` an open ring (being built, nothing to offer yet).
   Words: site.nav.status.<status> — `label` on screen, `long` for assistive technology. Server or client: the
   caller passes the dictionary. */

import type { TranslationDictionary } from "@/lib/i18n";
import type { ProductStatus as Status } from "@/lib/nav";
import { cn } from "@krizaka/ui/cn";

function Dot({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-1.5 shrink-0 rotate-45",
        status === "upcoming" || status === "devPreview" ? "bg-accent" : status === "development" ? "border-[1.5px] border-accent bg-accent/40" : "border-[1.5px] border-accent bg-transparent",
        className,
      )}
    />
  );
}

export function ProductStatus({
  status,
  t,
  variant = "chip",
  ring = false,
  className,
}: {
  status: Status;
  t: TranslationDictionary;
  variant?: "chip" | "dot";
  /** A dot laid over a mark: a ring in the surface colour sets it apart. */
  ring?: boolean;
  className?: string;
}) {
  const words = t.site.nav.status[status];
  if (variant === "dot")
    return (
      <span data-status={status} title={words.long} className={cn("inline-flex", className)}>
        <Dot status={status} className={cn("size-2", ring && "ring-2 ring-surface-1")} />
        <span className="sr-only">{words.long}</span>
      </span>
    );
  return (
    <span
      data-status={status}
      title={words.long}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-border-default px-1.5 py-px align-middle font-mono text-[11.5px] leading-4 text-fg-secondary",
        className,
      )}
    >
      <Dot status={status} />
      {words.label}
    </span>
  );
}
