import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalIcon, ForwardIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { DecisionList } from "@krizaka/ui/decision-list";
import { LinkCard } from "@krizaka/ui/link-card";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Mascot } from "@krizaka/ui/mascots";
import { Facts, Page, Section, Ticks } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { Toc, TocLayout } from "@krizaka/ui/toc";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import BlockIcon from "@/app/components/blocks/BlockIcon";
import FeedbackLinks from "@/app/components/blocks/FeedbackLinks";
import { BUILDING_BLOCKS, blockById, blockRepoUrl } from "@/lib/building-blocks";
import { LOCALES } from "@/lib/locales";
import { format, getDictionary } from "@/lib/i18n";
import { buildAlternates } from "@/lib/seo";
import { reveal } from "@/lib/motion";
import ButtonLink from "@/app/components/ButtonLink";

/* /open-source/<block> — why a Krizaka building block exists, for an engineer deciding whether to adopt it: the
   problem it removes, the decisions and what they cost, the code, when not to use it, where it stands, how to adopt
   it and where to argue. The "how" stays in the documentation it links to (java.krizaka.com, /docs/ui, the README).
   Built from the page blocks of @krizaka/ui (AGENTS.md §4.1): the page wears the block's hue (`data-hue` → --kz-hue),
   a sticky table of contents follows the reading. */

interface Props {
  params: Promise<{ locale: string; block: string }>;
}

export function generateStaticParams() {
  // The Java blocks' pages are on java.krizaka.com (lib/java-redirects.ts answers 308 for their old address).
  return LOCALES.flatMap((locale) => BUILDING_BLOCKS.filter((b) => b.forum === "ui").map((b) => ({ locale, block: b.id })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, block: id } = await params;
  const block = blockById(id);
  if (!block) return {};
  const w = getDictionary(locale).site.blocks;
  const item = w.items[block.id];
  return {
    title: format(w.page.metaTitle, { name: item.name }),
    description: item.tagline,
    alternates: buildAlternates(locale, `/open-source/${block.id}`),
  };
}

/** "krizaka/krizaka-build#11" for a GitHub issue or pull request URL. */
const shortRef = (url: string) => url.replace("https://github.com/krizaka/", "").replace(/\/(issues|pull)\//, "#");

export default async function BuildingBlockPage({ params }: Props) {
  const { locale, block: id } = await params;
  const block = blockById(id);
  if (!block) notFound();
  const w = getDictionary(locale).site.blocks;
  const p = w.page;
  const item = w.items[block.id];
  const next = item.next as Record<string, string>;

  const toc = [
    { id: "problem", label: p.problem },
    { id: "answer", label: w.answer },
    { id: "decisions", label: p.decisions },
    { id: "code", label: p.code },
    { id: "status", label: p.status },
    { id: "adopt", label: p.adopt },
    { id: "feedback-title", label: w.discuss },
  ];
  const release = block.releases[0];

  return (
    <main data-hue={block.hue} style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <PageHero
        back={{ href: "/open-source#blocks-title", label: p.back }}
        linkAs={Link}
        eyebrow={
          <>
            <BlockIcon icon={block.icon} size={18} /> {block.repo}
          </>
        }
        title={item.name}
        lead={item.tagline}
        aside={<Mascot bird={block.bird} mood={block.mood} size={112} />}
      >
        <Facts
          items={[
            { label: `${w[block.registry]} ${release.version}`, tone: "ok", href: release.url },
            ...(block.next.length > 0 ? [{ label: format(w.inProgress, { count: block.next.length }), tone: "wip" as const }] : []),
          ]}
        />
      </PageHero>

      <Page>
        <TocLayout toc={<Toc label={p.toc} items={toc} />}>
          {/* The first section is on the first screen of a phone: painted at once, no reveal (LCP). */}
          <Section id="problem" title={p.problem} headingSize="sm" spacing="sm">
            <p className="rd-hook">
              <Ticks>{item.headline}</Ticks>
            </p>
            <div className="rd-two">
              <p className="rd-prose">
                <Ticks>{item.trap}</Ticks>
              </p>
              <ul className="kz-list rd-no">
                {item.problem.map((line) => (
                  <li key={line}>
                    <Ticks>{line}</Ticks>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section id="answer" title={w.answer} headingSize="sm" spacing="sm" divider>
            <div className="rd-stack" {...reveal()}>
              <ul className="kz-list rd-large">
                {item.does.map((line) => (
                  <li key={line}>
                    <Ticks>{line}</Ticks>
                  </li>
                ))}
              </ul>
              <p className="rd-prose">
                <Ticks>{item.answer}</Ticks>
              </p>
              <MascotQuote variant="callout" bird={block.bird} mood={block.mood} label={format(w.birdSays, { bird: w.birds[block.bird] })}>
                <Ticks>{item.rule}</Ticks>
              </MascotQuote>
            </div>
          </Section>

          <Section id="decisions" title={p.decisions} headingSize="sm" spacing="sm" divider>
            <DecisionList
              decisions={item.decisions.map((d) => ({
                id: d.chose,
                chose: <Ticks>{d.chose}</Ticks>,
                refused: <Ticks>{d.refused}</Ticks>,
                because: <Ticks>{d.because}</Ticks>,
                cost: <Ticks>{d.cost}</Ticks>,
              }))}
              labels={p}
            />
          </Section>

          <Section id="code" title={p.code} headingSize="sm" spacing="sm" divider>
            <div {...reveal(0, "soft")}>
              <CodeBlock code={block.sample.code} language={block.sample.lang} file={block.sample.file} copyLabel={w.copy} copiedLabel={w.copied} />
            </div>
          </Section>

          <Section spacing="sm" divider aria-label={`${p.notFor} · ${p.status}`}>
            <div className="rd-two">
              <div className="rd-stack" {...reveal()}>
                <h2 id="not-for" className="kz-heading-title rd-h2">{p.notFor}</h2>
                <ul className="kz-list rd-no" aria-labelledby="not-for">
                  {item.notFor.map((line) => (
                    <li key={line}>
                      <Ticks>{line}</Ticks>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rd-stack" {...reveal(1)}>
                <h2 id="status" className="kz-heading-title rd-h2">{p.status}</h2>
                <p className="rd-prose is-small">
                  <Ticks>{item.status}</Ticks>
                </p>
                <p className="kz-label">{p.published}</p>
                <div className="rd-status">
                  {block.releases.map((r) => (
                    <a key={r.coordinate} href={r.url} target="_blank" rel="noopener noreferrer" className="rd-release">
                      <code>{r.coordinate}</code>
                      <span className="kz-fact" data-tone="ok">
                        <span className="kz-fact-dot" aria-hidden /> {r.version} · {w[block.registry]}
                      </span>
                    </a>
                  ))}
                </div>
                {block.next.length > 0 && (
                  <>
                    <p className="kz-label">{p.next}</p>
                    <ul className="rd-next">
                      {block.next.map((n) => (
                        <li key={n.key}>
                          <Ticks>{next[n.key]}</Ticks>
                          <a href={n.url} target="_blank" rel="noopener noreferrer">
                            {shortRef(n.url)} <ExternalIcon size={11} aria-hidden />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </Section>

          <Section id="adopt" title={p.adopt} headingSize="sm" spacing="sm" divider>
            <div className="rd-stack" {...reveal(0, "soft")}>
              {block.install.length > 1 ? (
                <CodeTabs
                  label={p.buildTool}
                  tabs={block.install.map((s, i) => ({
                    id: s.tab ?? String(i),
                    label: s.tab ?? s.file,
                    content: <CodeBlock code={s.code} language={s.lang} file={s.file} copyLabel={w.copy} copiedLabel={w.copied} />,
                  }))}
                />
              ) : (
                <CodeBlock code={block.install[0].code} language={block.install[0].lang} file={block.install[0].file} copyLabel={w.copy} copiedLabel={w.copied} />
              )}
              <div className="rd-links">
                <ButtonLink href={block.docs} variant="primary" size="lg" shimmer>
                  {p.docs} {block.docs.startsWith("/") ? <ForwardIcon size={14} aria-hidden /> : <ExternalIcon size={13} aria-hidden />}
                </ButtonLink>
                <ButtonLink href={blockRepoUrl(block)} size="lg">
                  {p.repo} <ExternalIcon size={13} aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </Section>

          <Section spacing="sm" divider aria-labelledby="feedback-title">
            <CtaPanel id="feedback-title" title={p.feedbackTitle} body={p.feedbackBody} reveal>
              <FeedbackLinks block={block} labels={w} />
            </CtaPanel>
          </Section>

          <Section id="others" title={p.others} headingSize="sm" spacing="sm" divider className="rd-last">
            <CardGrid as="ul" min={260} columns={2}>
              {BUILDING_BLOCKS.filter((b) => b.id !== block.id).map((b) => (
                <LinkCard
                  key={b.id}
                  data-hue={b.hue}
                  href={`/open-source/${b.id}`}
                  linkAs={Link}
                  icon={<BlockIcon icon={b.icon} size={20} />}
                  title={w.items[b.id].name}
                  titleAs="span"
                  description={<Ticks>{w.items[b.id].headline}</Ticks>}
                />
              ))}
            </CardGrid>
          </Section>
        </TocLayout>
      </Page>

      <SiteFooter />
    </main>
  );
}
