import type { ReactNode } from "react";
import { ChevronDownIcon, ForwardIcon } from "@krizaka/icons";
import type { MascotBird, MascotMood } from "@krizaka/ui/mascots";
import Badges, { type Badge } from "./Badges";
import Inline from "./Inline";
import MascotRule from "./MascotRule";
import ButtonLink from "./ButtonLink";

export interface ArgumentCardProps {
  id: string;
  /** The card's own accent (`[data-hue]` in sections.css): its rail, its icon's node, its bird, its light. */
  hue?: string;
  icon: ReactNode;
  title: string;
  /** A mono line under the title (a repository, a package). */
  meta?: string;
  /** Compact facts on one line: registry and version, status (`wip` said honestly). */
  badges?: readonly Badge[];
  /** Read in five seconds: the problem in one sentence, large. */
  hook: { label: string; text: string };
  /** What it does, as three short points (backticks = code). */
  points?: { label: string; items: readonly string[] };
  /** The long version, folded: a summary to open it, labelled paragraphs. */
  details?: { summary: string; points: readonly { label: string; text: string }[] };
  /** The rule a bird stands for, as a quote. */
  rule?: { bird: MascotBird; mood?: MascotMood; label: string; text: string };
  /** The way in: the primary button at the foot. */
  more?: { href: string; label: string };
  /** Secondary actions at the foot, right (ActionLinks variant="icons"). */
  actions?: ReactNode;
}

/** A card that argues, in reading order: who (icon, name, badges) → the problem in one line → what it does in three
    points → the rule told by a bird → the long version, folded → the way in. Cards of a row share their height; the
    fold and the foot sit at the bottom, so the eye finds them at the same place on every card. (The foot is a div, not
    a footer: MotionObserver watches page footers.) */
export default function ArgumentCard({ id, hue, icon, title, meta, badges, hook, points, details, rule, more, actions }: ArgumentCardProps) {
  return (
    <article className="ps-card" data-hue={hue} aria-labelledby={id}>
      <header className="ps-card-head">
        <span className="ps-card-icon">{icon}</span>
        <div className="ps-card-id">
          <h3 id={id}>{title}</h3>
          {meta && <p className="ps-card-meta">{meta}</p>}
        </div>
      </header>
      {badges && badges.length > 0 && <Badges items={badges} />}
      <div className="ps-card-hook">
        <p className="ps-label">{hook.label}</p>
        <p className="ps-hook-text">
          <Inline text={hook.text} />
        </p>
      </div>
      {points && (
        <div className="ps-card-points">
          <p className="ps-label">{points.label}</p>
          <ul className="ps-list is-tight">
            {points.items.map((item) => (
              <li key={item}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {rule && <MascotRule {...rule} />}
      {details && (
        <details className="ps-details">
          <summary>
            {details.summary} <ChevronDownIcon size={14} aria-hidden />
          </summary>
          <dl>
            {details.points.map((p) => (
              <div key={p.label}>
                <dt className="ps-label">{p.label}</dt>
                <dd>
                  <Inline text={p.text} />
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}
      {(more || actions) && (
        <div className="ps-card-foot">
          {more && (
            <ButtonLink href={more.href} className="ps-more">
              {more.label} <ForwardIcon size={14} aria-hidden />
              <span className="sr-only"> — {title}</span>
            </ButtonLink>
          )}
          {actions}
        </div>
      )}
    </article>
  );
}
