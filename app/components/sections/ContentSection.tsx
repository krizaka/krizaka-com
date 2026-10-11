import type { ReactNode } from "react";

/** A section of a reading page: a hairline above (the transition between sections), an h2, the content. */
export default function ContentSection({ id, title, children, className }: { id: string; title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={className ? `ps-section ${className}` : "ps-section"} aria-labelledby={title ? id : undefined}>
      {title && <h2 id={id}>{title}</h2>}
      {children}
    </section>
  );
}
