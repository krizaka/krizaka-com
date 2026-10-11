import type { ReactNode } from "react";
import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import type { MascotBird } from "@krizaka/ui/mascots";
import MascotRule from "./MascotRule";

export interface ArgumentCardProps {
  id: string;
  icon: ReactNode;
  title: string;
  /** A mono line under the title: repository, version, status. */
  meta?: string;
  /** The argument, in order: e.g. the trap → what it does. */
  points: readonly { label: string; text: string }[];
  /** The rule a bird stands for. */
  rule?: { bird: MascotBird; label: string; text: string };
  more?: { href: string; label: string };
  /** Secondary actions (discuss, propose, report…). */
  actions?: ReactNode;
}

/** A card that argues: icon and title, labelled points (problem → answer), the rule told by a bird, then the way in. */
export default function ArgumentCard({ id, icon, title, meta, points, rule, more, actions }: ArgumentCardProps) {
  return (
    <article className="ps-card" aria-labelledby={id}>
      <header className="ps-card-head">
        <span className="ps-card-icon">{icon}</span>
        <div>
          <h3 id={id}>{title}</h3>
          {meta && <p className="ps-card-meta">{meta}</p>}
        </div>
      </header>
      <dl className="ps-card-body">
        {points.map((p) => (
          <div key={p.label}>
            <dt>{p.label}</dt>
            <dd>{p.text}</dd>
          </div>
        ))}
      </dl>
      {rule && <MascotRule {...rule} />}
      {(more || actions) && (
        <footer className="ps-card-foot">
          {more && (
            <Link href={more.href} className="ps-more">
              {more.label} <ForwardIcon size={14} aria-hidden />
              <span className="sr-only"> — {title}</span>
            </Link>
          )}
          {actions}
        </footer>
      )}
    </article>
  );
}
