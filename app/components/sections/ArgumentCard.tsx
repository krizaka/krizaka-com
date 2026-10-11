import type { ReactNode } from "react";
import { ChevronDownIcon, ForwardIcon } from "@krizaka/icons";
import type { MascotBird, MascotMood } from "@krizaka/ui/mascots";
import Badges, { type Badge } from "./Badges";
import Inline from "./Inline";
import MascotRule from "./MascotRule";
import PageMascot from "./PageMascot";
import ButtonLink from "./ButtonLink";

export interface ArgumentCardProps {
  id: string;
  /** The card's own accent (`[data-hue]` in sections.css): its rail, its icon's node, its bird, its light. */
  hue?: string;
  icon: ReactNode;
  title: string;
  /** A mono line under the title (a repository, a package). */
  meta?: string;
  /** Compact facts on one line: registry and version (read at build), status (`wip` said honestly). */
  badges?: readonly Badge[];
  /** The problem in ONE line (≤ 90 characters): what a reader keeps if they read nothing else. `label` is read by
      assistive technology before it ("The trap"). */
  hook: { label: string; text: string };
  /** What it does — only in the unfolded card (never on the face of a card that has a detail page). */
  points?: { label: string; items: readonly string[] };
  /** The long version — only in the unfolded card. */
  details?: { points: readonly { label: string; text: string }[] };
  /** The rule a bird stands for. On the face of the card the bird is small, in the corner; its quote is in the fold. */
  rule?: { bird: MascotBird; mood?: MascotMood; label: string; text: string };
  /** The way in: a detail page. With it, the card is only its face — everything else lives on that page. */
  more?: { href: string; label: string };
  /** Without a detail page: the card unfolds in place (native <details>) — its summary, short ("Details"). */
  expand?: string;
  /** Secondary actions at the foot, right (ActionLinks variant="icons"), discreet. */
  actions?: ReactNode;
}

/** A card that argues, compact (AGENTS.md §4.1): who (icon, name, repository; the bird small in the corner) → the
    problem in one line → compact badges → one short action. What it does, the bird's rule and the long version are
    never on the face: they live on the detail page (`more`) or in the card, unfolded in place (`expand`). Cards of a
    row align at the top; unfolding one never stretches its neighbours. (The foot is a div, not a footer:
    MotionObserver watches page footers.) */
export default function ArgumentCard({ id, hue, icon, title, meta, badges, hook, points, details, rule, more, expand, actions }: ArgumentCardProps) {
  const fold = !more && expand && (points || rule || details);
  return (
    <article className="ps-card is-compact" data-hue={hue} aria-labelledby={id}>
      <header className="ps-card-head">
        <span className="ps-card-icon">{icon}</span>
        <div className="ps-card-id">
          <h3 id={id}>{title}</h3>
          {meta && <p className="ps-card-meta">{meta}</p>}
        </div>
        {rule && (
          <span className="ps-card-bird" aria-hidden>
            <PageMascot bird={rule.bird} mood={rule.mood ?? "thinking"} size={40} animated={false} />
          </span>
        )}
      </header>
      <p className="ps-card-line">
        <span className="sr-only">{hook.label} — </span>
        <Inline text={hook.text} />
      </p>
      {badges && badges.length > 0 && <Badges items={badges} />}
      {fold && (
        <details className="ps-card-fold">
          <summary>
            {expand} <ChevronDownIcon size={14} aria-hidden />
          </summary>
          <div className="ps-card-fold-body">
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
            {details && (
              <dl className="ps-card-dl">
                {details.points.map((p) => (
                  <div key={p.label}>
                    <dt className="ps-label">{p.label}</dt>
                    <dd>
                      <Inline text={p.text} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {rule && <MascotRule {...rule} />}
          </div>
        </details>
      )}
      {(more || actions) && (
        <div className="ps-card-foot">
          {more && (
            <ButtonLink href={more.href} size="sm" className="ps-more">
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
