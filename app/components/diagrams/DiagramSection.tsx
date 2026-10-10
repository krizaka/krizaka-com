/* The frame every schema section of a page shares: kicker, title, one line of context, the schema. */

import type { ReactNode } from "react";
import { reveal } from "@/lib/motion";

export default function DiagramSection({
  id,
  kicker,
  title,
  sub,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} style={{ maxWidth: "80rem", margin: "0 auto", padding: "40px 20px 56px", scrollMarginTop: 96 }}>
      <div style={{ maxWidth: 720, margin: "0 0 24px" }} {...reveal()}>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--kz-accent-text)",
          }}
        >
          {kicker}
        </p>
        <h2
          id={`${id}-title`}
          style={{
            margin: "10px 0 0",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.5rem, 3.6vw, 2rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "var(--kz-text-primary)",
          }}
        >
          {title}
        </h2>
        <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65, color: "var(--kz-text-secondary)" }}>{sub}</p>
      </div>
      {/* The schema arrives softly, once; after that it only answers the pointer (diagrams.module.css). */}
      <div {...reveal(1, "soft")}>{children}</div>
    </section>
  );
}
