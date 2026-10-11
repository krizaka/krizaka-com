/* A sequence written in a doc (```sequence), drawn as numbered steps in the schemas' visual language: the
   participants as chips (a module of the model wears its role's colour), then each step — who → whom, what —
   grouped by phase, a branch tagged with its condition. It is its own text version: an ordered list. No script. */

import { format } from "@krizaka/i18n";
import { getDictionary, type Locale } from "@/lib/i18n";
import { parseSequence, type SequenceItem, type SequenceParticipant } from "@/lib/structured-diagrams";
import type { Product } from "@/lib/architecture-model";
import { cn } from "@krizaka/ui/cn";
import s from "./diagrams.module.css";

function Who({ p }: { p: SequenceParticipant }) {
  return (
    <span className={cn(s.who, p.role ? s[`g-${p.role}`] : s.whoPlain)}>
      <i aria-hidden="true" />
      {p.label}
    </span>
  );
}

export default function SequenceDiagram({ source, product, locale }: { source: string; product: Product | null; locale: Locale }) {
  const t = getDictionary(locale).diagrams.sequence;
  const { participants, items } = parseSequence(source, product);
  const byKey = new Map(participants.map((p) => [p.key, p]));
  // Phases: the steps under each "## title" (a first group without a title when the block starts with steps).
  const groups: { title: string | null; steps: Extract<SequenceItem, { type: "step" }>[] }[] = [];
  for (const item of items) {
    if (item.type === "section") groups.push({ title: item.title, steps: [] });
    else {
      if (!groups.length) groups.push({ title: null, steps: [] });
      groups[groups.length - 1].steps.push(item);
    }
  }
  return (
    <figure className={cn(s.root, s.seq, "not-prose")} aria-label={t.label}>
      <div className={s.seqParticipants}>
        <span className={s.seqLabel}>{t.participants}</span>
        <ul>
          {participants.map((p) => (
            <li key={p.key}><Who p={p} /></li>
          ))}
        </ul>
      </div>
      {groups.map((g, gi) => (
        <div key={gi} className={s.seqGroup}>
          {g.title && <h4 className={s.seqPhase}>{g.title}</h4>}
          <ol className={s.steps} start={g.steps[0]?.n}>
            {g.steps.map((st) => {
              const from = byKey.get(st.from)!, to = byKey.get(st.to)!;
              return (
                <li key={st.n} className={cn(s.step, s[`g-${from.role ?? "contract"}`])} data-branch={st.branch ? "true" : undefined}>
                  <span className={s.stepRail}><span className={s.stepNum}>{st.n}</span></span>
                  <div className={s.stepBody}>
                    <div className={s.seqLine}>
                      {st.from === st.to ? (
                        <>
                          <Who p={from} />
                          <span className={s.seqSelf}>{format(t.internal, { name: from.label })}</span>
                        </>
                      ) : (
                        <>
                          <Who p={from} />
                          <span className={s.seqArrow} data-reply={st.reply ? "true" : undefined} aria-label={st.reply ? t.reply : undefined}>
                            {st.reply ? "↩" : "→"}
                          </span>
                          <Who p={to} />
                        </>
                      )}
                      {st.branch && (
                        <span className={s.badge}>{st.branch.kind === "if" ? format(t.if, { condition: st.branch.condition }) : format(t.else, { condition: st.branch.condition })}</span>
                      )}
                    </div>
                    <p className={s.seqText}>{st.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </figure>
  );
}
