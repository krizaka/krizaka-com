import type { ReactNode } from "react";
import { reveal } from "@/lib/motion";

/** The invitation to talk at the end of a section or a page: a title, why it matters, the ways to answer. */
export default function DiscussionCta({ id, title, body, children, level = 2 }: { id: string; title: string; body: string; children: ReactNode; level?: 2 | 3 }) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <div className="ps-cta" {...reveal()}>
      <div>
        <H id={id}>{title}</H>
        <p>{body}</p>
      </div>
      <div className="ps-cta-actions">{children}</div>
    </div>
  );
}
