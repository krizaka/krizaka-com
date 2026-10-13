import { ChatIcon, ForwardIcon, HeartIcon, KnowledgeIcon, LocalIcon, LockIcon, ShieldIcon, StoryIcon, UnlockIcon } from "@krizaka/icons";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { POLICY_SAMPLE, UNFILTERED_CASES, UNFILTERED_MODEL } from "@/lib/orazaka-unfiltered";
import Rich from "@/app/components/Rich";
import { CodeBlock } from "@krizaka/ui/code-block";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Ticks } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import s from "./unfiltered.module.css";

/* "Unfiltered models — your rules" (Orazaka). `pitch` on the product page: the promise, its three sides, the hard
   limits, a link to the answers. `demo` on /products/orazaka/demos: the questions, what a filter tends to do, what the
   real Orazaka answered (records: lib/orazaka-unfiltered.ts), then the operator's rule. Words: site.orazakaUnfiltered. */

const node = "var(--kz-accent)";
const PILLARS = [
  { id: "freedom", Icon: UnlockIcon },
  { id: "sovereignty", Icon: LocalIcon },
  { id: "responsibility", Icon: LockIcon },
] as const;
const CASE_ICON = { shield: ShieldIcon, heart: HeartIcon, knowledge: KnowledgeIcon, story: StoryIcon, chat: ChatIcon } as const;

export default function UnfilteredModels({ locale, variant }: { locale: Locale; variant: "pitch" | "demo" }) {
  const dict = getDictionary(locale);
  const t = dict.site.orazakaUnfiltered;
  const b = dict.site.blocks;

  const head = (
    <div {...reveal()}>
      <p className={s.badge}>
        <UnlockIcon size={15} nodeColor={node} /> {t.badge}
      </p>
      <h2 className="bp-h2">
        <Rich text={variant === "pitch" ? t.title : t.demo.title} />
      </h2>
      <p className="bp-lead">{variant === "pitch" ? t.lead : format(t.demo.lead, { model: UNFILTERED_MODEL })}</p>
    </div>
  );

  const limits = (
    <aside className={s.limits} {...reveal()}>
      <strong>{t.limits.title}</strong>
      <p>{t.limits.body}</p>
    </aside>
  );

  if (variant === "pitch") {
    return (
      <section id="unfiltered" className="kz-frame bp-wrap" style={{ scrollMarginTop: 72 }}>
        {head}
        <ul className={s.pillars}>
          {PILLARS.map(({ id, Icon }, i) => (
            <li key={id} className="bp-card" {...reveal(i + 1)}>
              <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
              <h3>{t.pillars[id].title}</h3>
              <p>{t.pillars[id].body}</p>
            </li>
          ))}
        </ul>
        <div className={s.after}>
          <MascotQuote bird="falcon" label={format(b.birdSays, { bird: b.birds.falcon })}>{t.rule}</MascotQuote>
          {limits}
        </div>
        <div className="bp-actions" {...reveal()}>
          <ButtonLink href="/products/orazaka/demos#unfiltered" variant="primary" size="lg">
            {t.cta} <ForwardIcon size={16} />
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section id="unfiltered" className="kz-frame bp-wrap" style={{ scrollMarginTop: 72 }}>
      {head}
      <ol className={s.cases}>
        {UNFILTERED_CASES.map(({ id, icon, conversation, prompt, answer }) => {
          const Icon = CASE_ICON[icon];
          const c = t.demo.cases[id];
          return (
            <li key={id} className={s.case} {...reveal()}>
              <header className={s.caseHead}>
                <span className="bp-icon"><Icon size={20} nodeColor={node} /></span>
                <span>
                  <strong>{c.who}</strong>
                  <span>{c.task}</span>
                </span>
              </header>
              <div className={s.exchange}>
                <div className={s.asked}>
                  <span className={s.label}>{t.demo.asked}</span>
                  <q lang="en">{prompt}</q>
                </div>
                <div className={s.filtered}>
                  <span className={s.label}>{t.demo.filtered}</span>
                  <p>{c.filtered}</p>
                </div>
                <div className={s.answered}>
                  <span className={s.label}>
                    {t.demo.answered} · <span className={s.model}>{UNFILTERED_MODEL}</span>
                  </span>
                  <div lang="en">
                    {answer.map((line) => (
                      <p key={line}><Ticks>{line}</Ticks></p>
                    ))}
                  </div>
                  <span className={s.trail}>{format(t.demo.recorded, { id: conversation.slice(0, 8) })}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <p className={s.note} {...reveal()}>
        {t.demo.filteredNote} {t.demo.accuracy}
      </p>
      {limits}

      <div id="policy" className={s.policy} style={{ scrollMarginTop: 72 }}>
        <div {...reveal()}>
          <p className="bp-eyebrow"><ShieldIcon size={18} nodeColor={node} /> {t.policy.eyebrow}</p>
          <h3 className={s.policyTitle}><Rich text={t.policy.title} /></h3>
          <p className="bp-lead">{t.policy.lead}</p>
          <ul className={s.points}>
            {t.policy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div {...reveal(2)}>
          <CodeBlock code={POLICY_SAMPLE.code} language={POLICY_SAMPLE.lang} file={POLICY_SAMPLE.file} copyLabel={b.copy} copiedLabel={b.copied} />
        </div>
      </div>
    </section>
  );
}
