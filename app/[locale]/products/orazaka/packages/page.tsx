import type { Metadata } from "next";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { SectionHeading } from "@krizaka/ui/page";
import Link from "next/link";
import {
  CheckIcon,
  CreditsIcon,
  EditIcon,
  EyeIcon,
  ForwardIcon,
  GoalIcon,
  HeartIcon,
  ImageIcon,
  KnowledgeIcon,
  MessageIcon,
  PackIcon,
  SearchIcon,
  ServerIcon,
  ShieldIcon,
  SoundIcon,
  StudioIcon,
  VideoIcon,
} from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { contactHref } from "@/lib/contact";
import { asLocale, format, getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";
import { reveal } from "@/lib/motion";
import { packText, packTitle, showcasePacks, type Pack } from "@/lib/orazaka-packs";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import Rich from "@/app/components/Rich";
import ButtonLink from "@/app/components/ButtonLink";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orazaka/packages",
    en: getDictionary("en").site.orazakaPacks.meta,
    fr: getDictionary("fr").site.orazakaPacks.meta,
  });
}

/* The packs' and Studios' iconKey (their manifests) → the signature icons. Structure, not words. */
const ICONS: Record<string, typeof StudioIcon> = {
  studio: StudioIcon,
  image: ImageIcon,
  target: GoalIcon,
  sparkles: HeartIcon,
  "shield-check": ShieldIcon,
  search: SearchIcon,
  send: MessageIcon,
  video: VideoIcon,
  speech: SoundIcon,
  audio: SoundIcon,
  vision: EyeIcon,
  notebook: EditIcon,
  "list-checks": CheckIcon,
  "chart-line": KnowledgeIcon,
};
const iconOf = (key: string | null) => (key && ICONS[key]) || StudioIcon;
const node = "var(--kz-accent)";

const DOCS = "/docs/orazaka/packs";
/* The commands of the three steps (orazaka-cli) — structure, beside their words in messages. */
const STEP_CODES = ["orazaka pack validate ./my-pack", "orazaka pack install ./my-pack", "orazaka studio run <installationId>"] as const;

/* The packs page: the packs that exist (generated from krizaka/orazaka-packs), what each one does, how a pack is
   installed and how one is written. Nothing here is a hand-written list of packs (lib/orazaka-packs.ts). */
export default async function OrazakaPacksPage({ params }: Props) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale).site.orazakaPacks;
  const packs = showcasePacks();
  const studios = packs.reduce((n, p) => n + p.studios.length, 0);

  const badges = (p: Pack) =>
    [
      p.workers.length > 0 && t.badges.worker,
      p.rulesets.length > 0 && format(t.badges.rulesets, { count: p.rulesets.length }),
      p.regulatoryClass === "SENSITIVE" && t.badges.sensitive,
      p.regulatoryClass === "REGULATED" && t.badges.regulated,
      p.kind === "TOOLKIT" && t.badges.toolkit,
    ].filter((b): b is string => Boolean(b));

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      <SectionBackdrop as="header" grid>
        <div className="kz-frame bp-wrap bp-hero bp-center">
          <p className="bp-eyebrow">
            <PackIcon size={18} nodeColor={node} /> {t.eyebrow}
          </p>
          <h1 className="bp-h1">
            <Rich text={t.title} />
          </h1>
          <p className="bp-lead" style={{ marginTop: 20 }}>{t.lead}</p>
          <div className="bp-actions">
            <ButtonLink href="#packs" variant="primary" size="lg" shimmer magnetic>
              {format(t.ctaBrowse, { count: packs.length })}
            </ButtonLink>
            <ButtonLink href={DOCS} size="lg">
              <KnowledgeIcon size={16} /> {t.ctaDocs}
            </ButtonLink>
          </div>
          <dl className="opk-facts">
            <div>
              <dt>{packs.length}</dt>
              <dd>{t.facts.packs}</dd>
            </div>
            <div>
              <dt>{studios}</dt>
              <dd>{t.facts.studios}</dd>
            </div>
            <div>
              <dt>0</dt>
              <dd>{t.facts.code}</dd>
            </div>
          </dl>
        </div>
      </SectionBackdrop>

      <section id="packs" className="kz-frame bp-wrap" style={{ scrollMarginTop: 72, paddingTop: 24 }}>
        <div className="opk-grid">
          {packs.map((p, i) => {
            const text = packText(p.text, locale);
            const Icon = iconOf(p.iconKey);
            return (
              <article key={p.key} id={`pack-${p.key}`} className="opk-pack" {...reveal(i)}>
                <header className="opk-head">
                  <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
                  <div>
                    <h2 className="opk-title">{packTitle(p, locale)}</h2>
                    {text.tagline && <p className="opk-tagline">{text.tagline}</p>}
                  </div>
                </header>
                {text.description && <p className="opk-desc">{text.description}</p>}
                {badges(p).length > 0 && (
                  <ul className="opk-badges" aria-label={t.badges.label}>
                    {badges(p).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                <h3 className="opk-studios-title">{p.studios.length === 1 ? t.studiosTitleOne : format(t.studiosTitle, { count: p.studios.length })}</h3>
                <ul className="opk-studios">
                  {p.studios.map((s) => {
                    const st = packText(s.text, locale);
                    const SIcon = iconOf(s.iconKey);
                    return (
                      <li key={s.key}>
                        <SIcon size={18} />
                        <span>
                          <strong>{st.label ?? s.key}</strong>
                          {st.tagline && <span className="opk-studio-tag">{st.tagline}</span>}
                        </span>
                        {s.estimatedCredits !== null && (
                          <span className="opk-credits" title={t.creditsHint}>
                            <CreditsIcon size={14} /> {s.estimatedCredits}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {p.rulesets.length > 0 && (
                  <p className="opk-rules">{format(t.rulesetsLine, { list: p.rulesets.map((r) => r.label).join(" · ") })}</p>
                )}
              </article>
            );
          })}
        </div>
        <p className="opk-note" {...reveal()}>
          {t.creditsNote}
        </p>
      </section>

      <SectionBackdrop className="bp-glide" dome={false} id="how">
        <div className="kz-frame bp-wrap">
          <SectionHeading eyebrow={t.how.eyebrow} title={<Rich text={t.how.title} />} lead={t.how.lead} align="center" reveal />
          <ol className="opk-steps">
            {t.how.steps.map((step, i) => (
              <li key={step.title} {...reveal(i + 1)}>
                <span className="opk-step-n">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <code>{STEP_CODES[i]}</code>
              </li>
            ))}
          </ol>
          <aside className="opk-aside" {...reveal()}>
            <ServerIcon size={18} />
            <p>
              <Rich text={t.how.useCases} />{" "}
              <Link href="/docs/orazaka/use_cases">{t.how.useCasesLink}</Link>
            </p>
          </aside>
        </div>
      </SectionBackdrop>

      <SectionBackdrop className="bp-glide" dome={false}>
        <section className="kz-frame bp-wrap" aria-labelledby="closing-title">
          <CtaPanel id="closing-title" title={<Rich text={t.closing.title} />} body={t.closing.body} reveal>
            <ButtonLink href={`${DOCS}#writing-a-pack`} variant="primary" size="lg">
              {t.closing.write} <ForwardIcon size={16} />
            </ButtonLink>
            <ButtonLink href={contactHref("orazaka", "orazaka")} size="lg">{t.closing.contact}</ButtonLink>
          </CtaPanel>
        </section>
      </SectionBackdrop>
      <SiteFooter />

      <style>{`
        .opk-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 40px auto 0; max-width: 40rem; text-align: left; }
        .opk-facts div { padding: 14px 16px; border-radius: 14px; border: 1px solid var(--kz-border-subtle); background: color-mix(in srgb, var(--kz-surface-1) 80%, transparent); }
        .opk-facts dt { font-family: var(--font-display), system-ui, sans-serif; font-size: 24px; font-weight: 800; color: var(--kz-accent-text); }
        .opk-facts dd { margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: var(--kz-text-secondary); }
        .opk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 16px; }
        .opk-pack { display: flex; flex-direction: column; gap: 12px; padding: 22px; border-radius: 18px; border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-1); scroll-margin-top: 80px; }
        .opk-head { display: flex; gap: 14px; align-items: flex-start; }
        .opk-title { margin: 0; font-size: 18px; font-weight: 750; letter-spacing: -.01em; }
        .opk-tagline { margin: 4px 0 0; font-size: 14px; font-weight: 600; color: var(--kz-accent-text); line-height: 1.45; }
        .opk-desc { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
        .opk-badges { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
        .opk-badges li { padding: 3px 9px; border-radius: 9999px; font-size: 11.5px; font-weight: 600; color: var(--kz-text-secondary); border: 1px solid var(--kz-border-default); }
        .opk-studios-title { margin: 6px 0 0; font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--kz-text-secondary); }
        .opk-studios { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
        .opk-studios li { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: start; padding: 10px 12px; border-radius: 12px; background: var(--kz-surface-2); }
        .opk-studios li > svg { margin-top: 2px; color: var(--kz-accent-text); }
        .opk-studios strong { display: block; font-size: 13.5px; color: var(--kz-text-primary); }
        .opk-studio-tag { display: block; margin-top: 2px; font-size: 12.5px; line-height: 1.5; color: var(--kz-text-secondary); }
        .opk-credits { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 11.5px; color: var(--kz-text-secondary); white-space: nowrap; }
        .opk-rules { margin: 0; font-size: 12.5px; line-height: 1.55; color: var(--kz-text-secondary); }
        .opk-note { margin: 20px 0 0; font-size: 12.5px; line-height: 1.6; color: var(--kz-text-secondary); display: flex; gap: 6px; align-items: center; }
        .opk-steps { margin: 36px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 14px; }
        .opk-steps li { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 22px; border-radius: 18px; border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-1); }
        .opk-step-n { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9999px; font-weight: 800; font-size: 13px; color: var(--kz-on-accent); background: var(--kz-accent); }
        .opk-steps h3 { margin: 4px 0 0; font-size: 16px; font-weight: 700; }
        .opk-steps p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .opk-steps code { margin-top: auto; padding: 8px 10px; border-radius: 10px; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-primary); background: var(--kz-surface-2); overflow-x: auto; white-space: nowrap; }
        .opk-aside { display: flex; gap: 12px; align-items: flex-start; margin-top: 24px; padding: 16px 18px; border-radius: 14px; border: 1px dashed var(--kz-border-default); }
        .opk-aside svg { flex-shrink: 0; margin-top: 2px; color: var(--kz-accent-text); }
        .opk-aside p { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
        .opk-aside a { color: var(--kz-accent-text); font-weight: 600; }
        @media (max-width: 520px) { .opk-facts { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
