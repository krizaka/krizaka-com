import type { Metadata } from "next";
import Link from "next/link";
import { ChatIcon, MessageIcon, ShieldIcon, ThreadIcon } from "@krizaka/icons";
import { ProductLogo, YororisLogo } from "@krizaka/ui";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { GitHubMark } from "@/app/components/brand/GitHubMark";
import { ActionBar } from "@krizaka/ui/action-bar";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { DecisionList } from "@krizaka/ui/decision-list";
import { LinkCard } from "@krizaka/ui/link-card";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Mascot } from "@krizaka/ui/mascots";
import { Facts, Section, Ticks } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import ButtonLink from "@/app/components/ButtonLink";
import { contactHref } from "@/lib/contact";
import { format, getDictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { localizedMetadata } from "@/lib/seo";
import { YORORIS_FRAMEWORK_URL, YORORIS_MOBILE_REPO_URL, YORORIS_REPO_URL } from "@/lib/site";

/* /products/yororis — the fourth Krizaka product, announced while it is being built, and said to be so: what it is,
   the trap it refuses, the moment in six steps, its signature (a presence that stops) told as decisions, the guards it
   gets from Orazaka's wellbeing pack, what it is not, and where it stands. Built from the page blocks of @krizaka/ui
   (AGENTS.md §4.1), under `.brand-yororis` (layout).
   Construction mode (krizaka/yororis docs/FRAMEWORK.md §5): nothing is live and nothing is offered, so the page has
   exactly one call to action — "Talk to us about Yororis" (the contact form, topic pre-selected) — and no trial,
   download, sign-up or waiting list. Its words pass the lexicon test (scripts/lexicon.mjs). The ids `how-it-works`,
   `stops` and `construction` are the navigation's anchors (lib/nav.ts); the Demo entry opens `construction`. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = getDictionary(locale).site.yororis.meta;
  const copy = { ...meta, og: meta };
  return localizedMetadata(locale, { path: "/products/yororis", en: copy, fr: copy });
}

/** The trap, in two cards (texts: messages → site.yororis.trap.cards.<id>). */
const TRAPS = [
  { id: "endless", Icon: ChatIcon },
  { id: "journal", Icon: MessageIcon },
] as const;

/** What Yororis is built with, and where it lives today. */
const BUILT_WITH = [
  { id: "pack", href: "/docs/orazaka", icon: <ProductLogo id="orazaka" size={20} animated={false} /> },
  { id: "adr", href: "https://github.com/krizaka/orazaka/blob/main/docs/adr/ADR-055-regulated-controls-and-the-wellbeing-pack.md", icon: <ShieldIcon size={20} aria-hidden /> },
  { id: "ui", href: "/docs/ui", icon: <ProductLogo id="krizaka" size={20} animated={false} /> },
] as const;

export default async function YororisPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const y = dict.site.yororis;
  const w = dict.site.blocks;
  const talk = contactHref("yororis", "yororis");

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <PageHero
        back={{ href: "/products", label: y.hero.back }}
        linkAs={Link}
        eyebrow={
          <>
            <YororisLogo size={18} animated={false} /> {y.hero.eyebrow}
          </>
        }
        title={y.hero.title}
        lead={y.hero.lead}
        aside={<Mascot bird="crane" mood="welcome" size={112} />}
      >
        <div className="rd-stack">
          <Facts
            aria-label={y.hero.badgesLabel}
            items={[{ label: dict.site.nav.status.construction.long, tone: "wip" }, { label: y.hero.badges.platforms }, { label: y.hero.badges.license }]}
          />
          <div className="rd-links">
            <ButtonLink href={talk} variant="primary" size="lg">
              <MessageIcon size={16} aria-hidden /> {y.talk}
            </ButtonLink>
          </div>
        </div>
      </PageHero>

      {/* The first section is on the first screen of a phone: painted at once, no reveal (LCP). */}
      <Section id="trap" title={y.trap.title} lead={y.trap.lead} headingSize="sm" spacing="sm">
        <CardGrid columns={2} min={300} reveal={false}>
          {TRAPS.map(({ id, Icon }) => {
            const card = y.trap.cards[id];
            return (
              <ArgumentCard
                key={id}
                id={`trap-${id}`}
                icon={<Icon size={22} aria-hidden />}
                title={card.title}
                meta={card.meta}
                hook={{ label: y.trap.label, text: card.hook }}
                points={{ label: y.trap.instead, items: card.items }}
                panelLabel={y.trap.expand}
              />
            );
          })}
        </CardGrid>
      </Section>

      <Section id="how-it-works" eyebrow={y.moment.eyebrow} title={y.moment.title} lead={y.moment.lead} reveal divider>
        <ol className="rd-steps" {...reveal()}>
          {y.moment.steps.map((step) => (
            <li key={step.title}>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="stops" eyebrow={y.stops.eyebrow} title={y.stops.title} headingSize="sm" divider>
        <div className="rd-stack">
          <p className="rd-prose" {...reveal()}>
            {y.stops.lead}
          </p>
          <DecisionList
            decisions={y.stops.decisions.map((d) => ({ id: d.chose, chose: <Ticks>{d.chose}</Ticks>, refused: <Ticks>{d.refused}</Ticks>, because: <Ticks>{d.because}</Ticks>, cost: <Ticks>{d.cost}</Ticks> }))}
            labels={w.page}
          />
        </div>
      </Section>

      <Section id="orazaka" title={y.pack.title} lead={y.pack.lead} headingSize="sm" divider>
        <div className="rd-two">
          <ul className="kz-list rd-large" {...reveal()}>
            {y.pack.items.map((line) => (
              <li key={line}>
                <Ticks>{line}</Ticks>
              </li>
            ))}
          </ul>
          <CardGrid as="ul" min={220} columns={1}>
            {BUILT_WITH.map(({ id, href, icon }) => (
              <LinkCard key={id} href={href} linkAs={Link} icon={icon} title={y.pack.links[id].name} titleAs="span" description={y.pack.links[id].line} />
            ))}
          </CardGrid>
        </div>
      </Section>

      <Section id="not" title={y.isNot.title} headingSize="sm" divider>
        <div className="rd-two">
          <div className="rd-stack" {...reveal()}>
            <p className="rd-prose">{y.isNot.lead}</p>
            <ul className="kz-list rd-no">
              {y.reviewed.isNot.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div {...reveal(1)}>
            <MascotQuote variant="callout" bird="falcon" mood="thinking" label={format(w.birdSays, { bird: w.birds.falcon })}>
              {y.reviewed.isNotRule}
            </MascotQuote>
          </div>
        </div>
      </Section>

      <Section id="construction" eyebrow={dict.site.nav.status.construction.long} title={y.construction.title} headingSize="sm" divider>
        <div className="rd-stack">
          <p className="rd-hook" {...reveal()}>
            {y.reviewed.construction}
          </p>
          <div className="rd-two">
            <div className="rd-stack" {...reveal()}>
              <h3 className="rd-h3">{y.construction.studyTitle}</h3>
              <p className="rd-prose is-small">{y.construction.studyLead}</p>
              <ul className="kz-list">
                {y.construction.study.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="rd-stack" {...reveal(1)}>
              <h3 className="rd-h3">{y.construction.buildTitle}</h3>
              <ul className="kz-list">
                {y.construction.build.map((line) => (
                  <li key={line}>
                    <Ticks>{line}</Ticks>
                  </li>
                ))}
              </ul>
              <MascotQuote bird="crane" mood="thinking" label={format(w.birdSays, { bird: w.birds.crane })}>
                {y.construction.rule}
              </MascotQuote>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="sm" aria-labelledby="talk-title">
        <CtaPanel id="talk-title" title={y.follow.title} body={y.follow.body} reveal>
          <ButtonLink href={talk} variant="primary" size="lg">
            <MessageIcon size={16} aria-hidden /> {y.talk}
          </ButtonLink>
          <ActionBar
            label={y.follow.reposLabel}
            actions={[
              { href: YORORIS_REPO_URL, label: y.follow.repo, icon: <GitHubMark size={14} /> },
              { href: YORORIS_MOBILE_REPO_URL, label: y.follow.mobile, icon: <GitHubMark size={14} /> },
              { href: YORORIS_FRAMEWORK_URL, label: y.follow.framework, icon: <ThreadIcon size={14} aria-hidden /> },
            ]}
          />
        </CtaPanel>
      </Section>

      <SiteFooter />
    </main>
  );
}

