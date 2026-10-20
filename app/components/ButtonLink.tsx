import type { ReactNode } from "react";
import Link from "next/link";
import { Button, type ButtonProps } from "@krizaka/ui/button";

/** Every action of the site is the @krizaka/ui `Button` (asChild on a link): one look, one set of sizes and states.
    `primary` for the one action a block is about, `secondary` for the others; one shape, the Button's default (8 px, no
    chamfer — krizaka-ui#393). `lg` on a hero or a closing call, `md` in a section, `sm` in a card. Internal paths go through next/link; anything else opens in a new tab. */
export default function ButtonLink({
  href,
  children,
  variant = "secondary",
  size = "md",
  shape,
  prefetch,
  rel,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  shape?: ButtonProps["shape"];
  prefetch?: boolean;
  /** For an external link: `noopener` keeps the referrer (the running app), `noopener noreferrer` by default. */
  rel?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const internal = href.startsWith("/") || href.startsWith("#");
  return (
    <Button asChild variant={variant} size={size} shape={shape} className={className}>
      {internal ? (
        <Link href={href} prefetch={prefetch} aria-label={ariaLabel}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel={rel ?? "noopener noreferrer"} aria-label={ariaLabel}>
          {children}
        </a>
      )}
    </Button>
  );
}
