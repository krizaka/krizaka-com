import { reveal } from "@/lib/motion";

/** The head of a page section: eyebrow (mono, accent), title, lead. Rises once into place (never on the first screen:
    pass `still` there). */
export default function SectionHeading({ id, eyebrow, title, lead, still = false }: { id: string; eyebrow?: string; title: string; lead?: string; still?: boolean }) {
  return (
    <div className="ps-heading" {...(still ? {} : reveal())}>
      {eyebrow && <p className="ps-eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {lead && <p className="ps-lead">{lead}</p>}
    </div>
  );
}
