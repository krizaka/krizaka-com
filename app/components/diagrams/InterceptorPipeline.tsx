/* ─────────────────────────────────────────────────────────────────────────
   INTERCEPTOR PIPELINE — what a turn goes through, in order
   Phase 1 is the core chain PipelineRegistry fixes in code (non-bypassable);
   phase 2 the rows of pipeline_interceptor_config, by their DB order (two
   rows may share one: drawn side by side). Read from app/data/architecture.json.
   The steps ARE ordered lists, so the structure is the text alternative.
   Server component: no state, no motion. Colours: the domain accent for the
   core chain, the application amber (orazaka-interceptors' band on the map)
   for the configured one.
   ───────────────────────────────────────────────────────────────────────── */

import { LockIcon, SettingsIcon, WarningIcon } from "@krizaka/icons";
import type { PipelineStep } from "@/lib/architecture-model";
import type { TranslationDictionary } from "@/lib/i18n";
import { cn } from "@krizaka/ui/cn";
import s from "./diagrams.module.css";

type Text = TranslationDictionary["diagrams"]["pipeline"];

function concernLabel(text: Text, concern: string | null) {
  if (!concern) return null;
  return text.concerns[concern as keyof Text["concerns"]] ?? concern;
}

/** Javadoc `code` spans rendered as code. */
function Prose({ text }: { text: string }) {
  return <>{text.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i} style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.92em" }}>{part}</code> : part))}</>;
}

function StepBody({ step, text }: { step: PipelineStep; text: Text }) {
  return (
    <div>
      <div className={s.stepName}>
        <code>{step.interceptor}</code>
        {step.concern && <span className={s.concern}>{concernLabel(text, step.concern)}</span>}
        {step.phase === "core" && <span className={s.badge}><LockIcon size={11} /> {text.locked}</span>}
        {!step.enabled && <span className={s.badge}>{text.off}</span>}
        {!step.implemented && <span className={s.badge} data-warn="true"><WarningIcon size={11} /> {text.noClass}</span>}
      </div>
      {step.summary && <p className={s.stepText}><Prose text={step.summary} /></p>}
    </div>
  );
}

export default function InterceptorPipeline({ steps, text }: { steps: PipelineStep[]; text: Text }) {
  const core = steps.filter((x) => x.phase === "core");
  const groups: PipelineStep[][] = [];
  for (const st of steps.filter((x) => x.phase === "dynamic")) {
    const last = groups[groups.length - 1];
    if (last && last[0].order === st.order) last.push(st);
    else groups.push([st]);
  }
  return (
    <section className={s.root} aria-label={text.label}>
      <div className={s.phases}>
        <div className={cn(s.phase, s["g-domain"])}>
          <div className={s.phaseHead}>
            <span className={s.bandIcon}><LockIcon size={17} /></span>
            <div>
              <h3 className={s.phaseTitle}>{text.core.title}</h3>
              <p className={s.phaseSub}>{text.core.sub}</p>
            </div>
          </div>
          <ol className={s.steps}>
            {core.map((st) => (
              <li key={st.interceptor} className={s.step}>
                <span className={s.stepRail}><span className={s.stepNum}>{st.order}</span></span>
                <div className={s.stepBody}><StepBody step={st} text={text} /></div>
              </li>
            ))}
          </ol>
        </div>
        <div className={cn(s.phase, s["g-application"])}>
          <div className={s.phaseHead}>
            <span className={s.bandIcon}><SettingsIcon size={17} /></span>
            <div>
              <h3 className={s.phaseTitle}>{text.dynamic.title}</h3>
              <p className={s.phaseSub}>{text.dynamic.sub}</p>
            </div>
          </div>
          <ol className={s.steps}>
            {groups.map((g) => (
              <li key={g[0].order} className={s.step} data-muted={g.every((x) => !x.implemented) ? "true" : undefined} value={g[0].order}>
                <span className={s.stepRail}><span className={s.stepNum}>{g[0].order}</span></span>
                <div className={s.stepBody}>
                  {g.length > 1 ? (
                    <>
                      <span className={s.badge} style={{ marginBottom: 6 }}>{text.sameOrder}</span>
                      <div className={s.parallel}>
                        {g.map((st) => <StepBody key={st.interceptor} step={st} text={text} />)}
                      </div>
                    </>
                  ) : (
                    <StepBody step={g[0]} text={text} />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
