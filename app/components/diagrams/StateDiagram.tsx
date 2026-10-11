/* A state machine written in a doc (```states), drawn as cards in reading order — breadth-first from the start —
   each with the transitions that leave it and why. States named by an `enum:` are checked against the schema.
   It is its own text version: every state and transition is text. No script. */

import { getDictionary, type Locale } from "@/lib/i18n";
import { parseStates } from "@/lib/structured-diagrams";
import type { Product } from "@/lib/architecture-model";
import { cn } from "@krizaka/ui/cn";
import s from "./diagrams.module.css";

export default function StateDiagram({ source, product, locale }: { source: string; product: Product | null; locale: Locale }) {
  const t = getDictionary(locale).diagrams.states;
  const block = parseStates(source, product);
  const target = (id: string) => (id === "end" ? t.end : id);
  const out = (from: string) => block.transitions.filter((x) => x.from === from);
  const transitions = (from: string) => {
    const list = out(from);
    return list.length ? (
      <ul className={s.stateOut}>
        {list.map((x, i) => (
          <li key={i}>
            <span className={s.stateTo} data-self={x.to === from ? "true" : undefined} data-end={x.to === "end" ? "true" : undefined}>
              {x.to === from ? "↻" : "→"} {target(x.to)}
            </span>
            <span className={s.stateWhy}>{x.label}</span>
          </li>
        ))}
      </ul>
    ) : null;
  };
  return (
    <figure className={cn(s.root, s.states, "not-prose")} aria-label={block.enumName ? `${t.label} — ${block.enumName}` : t.label}>
      <ol className={s.stateGrid}>
        <li className={cn(s.stateCard, s.stateStart)}>
          <div className={s.stateHead}>
            <span className={s.stateName}>{t.start}</span>
          </div>
          {transitions("start")}
        </li>
        {block.states.map((st) => (
          <li key={st.id} className={s.stateCard} data-final={st.final ? "true" : undefined}>
            <div className={s.stateHead}>
              <code className={s.stateName}>{st.id}</code>
              {st.initial && <span className={s.badge}>{t.initial}</span>}
              {st.final && <span className={s.badge}>{t.final}</span>}
            </div>
            {st.label && <p className={s.stateLabel}>{st.label}</p>}
            {transitions(st.id)}
          </li>
        ))}
      </ol>
    </figure>
  );
}
