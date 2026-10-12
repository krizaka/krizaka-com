import type { Metadata } from "next";
import Link from "next/link";
import { BatchIcon, ChatIcon, DebriefIcon, ExternalIcon, IntroIcon, NotificationIcon } from "@krizaka/icons";
import { ProductLogo, YazakiaLogo } from "@krizaka/ui";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { GitHubMark } from "@/app/components/brand/GitHubMark";
import { ArgumentCard, Badges, CardGrid, ContentSection, DecisionList, DiscussionCta, Inline, MascotRule, PageHero, SectionHeading } from "@/app/components/sections";
import ButtonLink from "@/app/components/sections/ButtonLink";
import { contactHref } from "@/lib/contact";
import { format, getDictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { localizedMetadata } from "@/lib/seo";
import { YAZAKIA_MOBILE_REPO_URL, YAZAKIA_REPO_URL } from "@/lib/site";

/* /products/yazakia — the third Krizaka product, announced before it ships: the promise, the trap it refuses, the
   loop in four steps, its signature (mutual batches) told as decisions, privacy by design, what it is built with, and
   how to hear about the first build. Built from the page language (AGENTS.md §4.1), under `.brand-yazakia` (layout).
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
        eyebrow={
          <>
            <YazakiaLogo size={18} animated={false} /> {y.hero.eyebrow}
          </>
        }
        title={y.hero.title}
        lead={y.hero.lead}
        mascot={{ bird: "lovebird", mood: "welcome" }}
      >
        <div className="ps-stack">
          <Badges
            label={y.hero.badgesLabel}
            items={[
              { label: y.hero.badges.soon, tone: "wip" },
              { label: y.hero.badges.platforms },
              { label: y.hero.badges.license },
            ]}
          />
          <div className="ps-links">
            <ButtonLink href={notify} variant="primary" size="lg" shimmer magnetic>
              <NotificationIcon size={16} aria-hidden /> {y.hero.notify}
            </ButtonLink>
            <ButtonLink href={YAZAKIA_REPO_URL} size="lg">
              <GitHubMark size={14} /> {y.hero.github}
            </ButtonLink>
          </div>
        </div>
      </PageHero>

      <div className="ps-page">
        {/* The first section is on the first screen of a phone: painted at once, no reveal (LCP). */}
        <ContentSection id="trap" title={y.trap.title}>
          <p className="ps-hook">{y.trap.hook}</p>
          <div className="ps-two">
            <p className="ps-prose">{y.trap.body}</p>
            <ul className="ps-list is-no">
              {y.trap.items.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </ContentSection>

        <section className="ps-section" aria-labelledby="architecture">
          <SectionHeading id="architecture" eyebrow={y.loop.eyebrow} title={y.loop.title} lead={y.loop.lead} />
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
                  hook={{ label: y.loop.promise, text: step.hook }}
                  points={{ label: y.loop.what, items: step.items }}
                  rule={id === "intro" ? { bird: "lovebird", mood: "welcome", label: format(w.birdSays, { bird: w.birds.lovebird }), text: y.loop.rule } : undefined}
                  expand={y.loop.expand}
                />
              );
            })}
          </CardGrid>
        </section>

        <ContentSection id="matching" title={y.matching.title}>
          <div className="ps-stack">
            <p className="ps-prose" {...reveal()}>
              {y.matching.lead}
            </p>
            <DecisionList decisions={y.matching.decisions} labels={w.page} />
          </div>
        </ContentSection>

        <ContentSection id="privacy" title={y.privacy.title}>
          <div className="ps-two">
            <div className="ps-stack" {...reveal()}>
              <p className="ps-prose">{y.privacy.lead}</p>
              <ul className="ps-list is-yes">
                {y.privacy.items.map((line) => (
                  <li key={line}>
                    <Inline text={line} />
                  </li>
                ))}
              </ul>
            </div>
            <div {...reveal(1)}>
              <MascotRule variant="callout" bird="falcon" mood="thinking" label={format(w.birdSays, { bird: w.birds.falcon })} text={y.privacy.rule} />
            </div>
          </div>
        </ContentSection>

        <ContentSection id="built-with" title={y.built.title}>
          <div className="ps-stack">
            <p className="ps-prose">{y.built.lead}</p>
            <ul className="ps-tiles" {...reveal(0, "soft")}>
              {BUILT_WITH.map(({ id, href, icon }) => {
                const item = y.built.items[id];
                const body = (
                  <>
                    {icon}
                    <span>
                      <strong>{item.name}</strong>
                      <span>{item.line}</span>
                    </span>
                  </>
                );
                return (
                  <li key={id}>
                    {href.startsWith("/") ? (
                      <Link href={href} prefetch={false}>
                        {body}
                      </Link>
                    ) : (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {body}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </ContentSection>

        <ContentSection id="follow" className="is-last">
          <DiscussionCta id="follow-title" title={y.follow.title} body={y.follow.body}>
            <ButtonLink href={notify} variant="primary" size="lg">
              <NotificationIcon size={16} aria-hidden /> {y.hero.notify}
            </ButtonLink>
            <ul className="ps-actions" aria-label={y.follow.reposLabel}>
              <li>
                <ButtonLink href={YAZAKIA_REPO_URL}>
                  <GitHubMark size={14} /> {y.follow.api} <ExternalIcon size={12} aria-hidden />
                </ButtonLink>
              </li>
              <li>
                <ButtonLink href={YAZAKIA_MOBILE_REPO_URL}>
                  <GitHubMark size={14} /> {y.follow.mobile} <ExternalIcon size={12} aria-hidden />
                </ButtonLink>
              </li>
            </ul>
          </DiscussionCta>
        </ContentSection>
      </div>

      <SiteFooter />
    </main>
  );
}
