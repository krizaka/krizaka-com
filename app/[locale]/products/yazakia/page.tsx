import type { Metadata } from "next";
import { ProductFaq } from "@/app/components/ProductFaq";
import Link from "next/link";
import { BatchIcon, ChatIcon, DebriefIcon, IntroIcon, NotificationIcon } from "@krizaka/icons";
import { ProductLogo, YazakiaLogo } from "@krizaka/ui";
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
import { YAZAKIA_MOBILE_REPO_URL, YAZAKIA_REPO_URL } from "@/lib/site";

/* /products/yazakia — the third Krizaka product, announced before it ships: the promise, the trap it refuses, the
   loop in four steps, its signature (mutual batches) told as decisions, privacy by design, what it is built with, and
   how to hear about the first build. Built from the page blocks of @krizaka/ui (AGENTS.md §4.1), under `.brand-yazakia` (layout).
   Nothing here is invented: no screenshot, no profile, no figure, no store button — the demo, the documentation and
   the state-machine schema join this structure once the app and its generated data exist (the ids `architecture` and
   `matching` are the navigation's anchors, lib/nav.ts). */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = getDictionary(locale).site.yazakia.meta;
  const copy = { ...meta, og: meta };
  return localizedMetadata(locale, { path: "/products/yazakia", en: copy, fr: copy });
}

/** The loop, in its order (texts: messages → site.yazakia.loop.steps.<id>). */
const STEPS = [
  { id: "talk", Icon: ChatIcon },
  { id: "batch", Icon: BatchIcon },
  { id: "debrief", Icon: DebriefIcon },
  { id: "intro", Icon: IntroIcon },
] as const;

/** What Yazakia is built with — each links to where it lives today. */
const BUILT_WITH = [
  { id: "orazaka", href: "/products/orazaka", icon: <ProductLogo id="orazaka" size={20} animated={false} /> },
  { id: "ui", href: "/docs/ui", icon: <ProductLogo id="krizaka" size={20} animated={false} /> },
  { id: "realtime", href: "https://github.com/krizaka/krizaka-ui/issues/75", icon: <NotificationIcon size={20} aria-hidden /> },
] as const;

export default async function YazakiaPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const y = dict.site.yazakia;
  const w = dict.site.blocks;
  const notify = contactHref("yazakia", "yazakia");

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <PageHero
        back={{ href: "/products", label: y.hero.back }}
        linkAs={Link}
        eyebrow={
          <>
            <YazakiaLogo size={18} animated={false} /> {y.hero.eyebrow}
          </>
        }
        title={y.hero.title}
        lead={y.hero.lead}
        aside={<Mascot bird="lovebird" mood="welcome" size={112} />}
      >
        <div className="rd-stack">
          <Facts
            aria-label={y.hero.badgesLabel}
            items={[{ label: y.hero.badges.soon, tone: "wip" }, { label: y.hero.badges.platforms }, { label: y.hero.badges.license }]}
          />
          <div className="rd-links">
            <ButtonLink href={notify} variant="primary" size="lg" shimmer magnetic>
              <NotificationIcon size={16} aria-hidden /> {y.hero.notify}
            </ButtonLink>
            <ButtonLink href={YAZAKIA_REPO_URL} size="lg">
              <GitHubMark size={14} /> {y.hero.github}
            </ButtonLink>
          </div>
        </div>
      </PageHero>

      {/* The first section is on the first screen of a phone: painted at once, no reveal (LCP). */}
      <Section id="trap" title={y.trap.title} headingSize="sm" spacing="sm">
        <p className="rd-hook">{y.trap.hook}</p>
        <div className="rd-two">
          <p className="rd-prose">{y.trap.body}</p>
          <ul className="kz-list rd-no">
            {y.trap.items.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="architecture" eyebrow={y.loop.eyebrow} title={y.loop.title} lead={y.loop.lead} reveal divider>
        <CardGrid columns={4} min={250}>
          {STEPS.map(({ id, Icon }) => {
            const step = y.loop.steps[id];
            return (
              <ArgumentCard
                key={id}
                id={`step-${id}`}
                icon={<Icon size={22} aria-hidden />}
                title={step.title}
                meta={step.meta}
                mark={id === "intro" ? <Mascot bird="lovebird" size={40} animated={false} /> : undefined}
                hook={{ label: y.loop.promise, text: step.hook }}
                points={{ label: y.loop.what, items: step.items }}
                rule={
                  id === "intro" ? (
                    <MascotQuote bird="lovebird" mood="welcome" label={format(w.birdSays, { bird: w.birds.lovebird })}>
                      {y.loop.rule}
                    </MascotQuote>
                  ) : undefined
                }
                panelLabel={y.loop.expand}
              />
            );
          })}
        </CardGrid>
      </Section>

      <Section id="matching" title={y.matching.title} headingSize="sm" divider>
        <div className="rd-stack">
          <p className="rd-prose" {...reveal()}>
            {y.matching.lead}
          </p>
          <DecisionList
            decisions={y.matching.decisions.map((d) => ({ id: d.chose, chose: <Ticks>{d.chose}</Ticks>, refused: <Ticks>{d.refused}</Ticks>, because: <Ticks>{d.because}</Ticks>, cost: <Ticks>{d.cost}</Ticks> }))}
            labels={w.page}
          />
        </div>
      </Section>

      <Section id="privacy" title={y.privacy.title} headingSize="sm" divider>
        <div className="rd-two">
          <div className="rd-stack" {...reveal()}>
            <p className="rd-prose">{y.privacy.lead}</p>
            <ul className="kz-list rd-large">
              {y.privacy.items.map((line) => (
                <li key={line}>
                  <Ticks>{line}</Ticks>
                </li>
              ))}
            </ul>
          </div>
          <div {...reveal(1)}>
            <MascotQuote variant="callout" bird="falcon" mood="thinking" label={format(w.birdSays, { bird: w.birds.falcon })}>
              {y.privacy.rule}
            </MascotQuote>
          </div>
        </div>
      </Section>

      <Section id="built-with" title={y.built.title} lead={y.built.lead} headingSize="sm" divider>
        <CardGrid as="ul" min={240} columns={3}>
          {BUILT_WITH.map(({ id, href, icon }) => (
            <LinkCard key={id} href={href} linkAs={Link} icon={icon} title={y.built.items[id].name} titleAs="span" description={y.built.items[id].line} />
          ))}
        </CardGrid>
      </Section>

      <Section spacing="sm" aria-labelledby="follow-title">
        <CtaPanel id="follow-title" title={y.follow.title} body={y.follow.body} reveal>
          <ButtonLink href={notify} variant="primary" size="lg">
            <NotificationIcon size={16} aria-hidden /> {y.hero.notify}
          </ButtonLink>
          <ActionBar
            label={y.follow.reposLabel}
            actions={[
              { href: YAZAKIA_REPO_URL, label: y.follow.api, icon: <GitHubMark size={14} /> },
              { href: YAZAKIA_MOBILE_REPO_URL, label: y.follow.mobile, icon: <GitHubMark size={14} /> },
            ]}
          />
        </CtaPanel>
      </Section>

      <ProductFaq product="yazakia" locale={locale} />
      <SiteFooter />
    </main>
  );
}
