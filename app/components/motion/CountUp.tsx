/* A figure that climbs to its value the first time it scrolls into view (SiteMotion). Server-safe.
   The server renders the final value — what crawlers, screen readers, reduced-motion visitors and anyone without JS
   read — and the box keeps the width of that final value from the first paint (an invisible copy shares its grid cell), so counting never
   moves the text around it (CLS). Assistive technology reads the final value only (the moving digits are hidden). */

import { cn } from "@krizaka/ui/cn";

export default function CountUp({ value, locale, decimals = 0, className }: { value: number; locale: string; decimals?: number; className?: string }) {
  const text = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  return (
    <span className={cn("kz-count", className)}>
      <span aria-hidden className="kz-count-box">
        <span className="kz-count-ghost">{text}</span>
        <span data-count-to={value} data-count-decimals={decimals || undefined}>
          {text}
        </span>
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
