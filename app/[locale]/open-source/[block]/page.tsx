import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalIcon, ForwardIcon } from "@krizaka/icons";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import BlockIcon from "@/app/components/blocks/BlockIcon";
import FeedbackLinks from "@/app/components/blocks/FeedbackLinks";
import { CodeSample, ContentSection, DecisionList, DiscussionCta, MascotRule, PageHero } from "@/app/components/sections";
import "@/app/components/sections/sections.css";
import { BUILDING_BLOCKS, blockById, blockRepoUrl } from "@/lib/building-blocks";
import { LOCALES } from "@/lib/locales";
import { format, getDictionary } from "@/lib/i18n";
import { buildAlternates } from "@/lib/seo";
import { reveal } from "@/lib/motion";

/* /open-source/<block> — why a Krizaka building block exists, for an engineer deciding whether to adopt it: the
   problem it removes, the decisions and what they cost, the code, when not to use it, where it stands, how to adopt
   it and where to argue. The "how" stays in the documentation it links to (/docs/java, /docs/ui, the README).
   Built from the page language (app/components/sections, AGENTS.md §4.1). */

interface Props {
  params: Promise<{ locale: string; block: string }>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => BUILDING_BLOCKS.map((b) => ({ locale, block: b.id })));
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

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <PageHero
        back={{ href: "/open-source#building-blocks", label: p.back }}
        eyebrow={
          <>
            <BlockIcon icon={block.icon} size={18} /> {block.repo}
          </>
        }
        title={item.name}
        lead={item.tagline}
        mascot={{ bird: block.bird }}
      />

      <div className="ps-page">
        {/* The first section is on the first screen of a phone: painted at once, no reveal (LCP). */}
        <ContentSection id="problem" title={p.problem}>
          <div className="ps-two">
            <p className="ps-prose">{item.trap}</p>
            <ul className="ps-list">
              {item.problem.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </ContentSection>

        <ContentSection id="answer" title={w.answer}>
          <div className="ps-stack" {...reveal()}>
            <p className="ps-prose">{item.answer}</p>
            <MascotRule variant="callout" bird={block.bird} label={format(w.birdSays, { bird: w.birds[block.bird] })} text={item.rule} />
          </div>
        </ContentSection>

        <ContentSection id="decisions" title={p.decisions}>
          <DecisionList decisions={item.decisions} labels={p} />
        </ContentSection>

        <ContentSection id="code" title={p.code}>
          <div {...reveal(0, "soft")}>
            <CodeSample sample={block.sample} copy={w.copy} copied={w.copied} />
          </div>
        </ContentSection>

        <ContentSection id="fit">
          <div className="ps-two">
            <div className="ps-stack" {...reveal()}>
              <h2 id="not-for" className="ps-h2">{p.notFor}</h2>
              <ul className="ps-list is-no" aria-labelledby="not-for">
                {item.notFor.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="ps-stack" {...reveal(1)}>
              <h2 className="ps-h2">{p.status}</h2>
              <p className="ps-prose is-small">{item.status}</p>
              <p className="ps-label">{p.published}</p>
              <div className="ps-status">
                {block.releases.map((r) => (
                  <a key={r.coordinate} href={r.url} target="_blank" rel="noopener noreferrer" className="ps-release">
                    <code>{r.coordinate}</code>
                    <span>
                      {r.version} · {w[block.registry]}
                    </span>
                  </a>
                ))}
              </div>
              {block.next.length > 0 && (
                <>
                  <p className="ps-label">{p.next}</p>
                  <ul className="ps-next">
                    {block.next.map((n) => (
                      <li key={n.key}>
                        {next[n.key]}
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
        </ContentSection>

        <ContentSection id="adopt" title={p.adopt}>
          <div className="ps-stack" {...reveal(0, "soft")}>
            <CodeSample sample={block.install} copy={w.copy} copied={w.copied} />
            <div className="ps-links">
              {block.docs.startsWith("/") ? (
                <Link href={block.docs} className="ps-btn is-primary">
                  {p.docs} <ForwardIcon size={14} aria-hidden />
                </Link>
              ) : (
                <a href={block.docs} target="_blank" rel="noopener noreferrer" className="ps-btn is-primary">
                  {p.docs} <ExternalIcon size={13} aria-hidden />
                </a>
              )}
              <a href={blockRepoUrl(block)} target="_blank" rel="noopener noreferrer" className="ps-btn">
                {p.repo} <ExternalIcon size={13} aria-hidden />
              </a>
            </div>
          </div>
        </ContentSection>

        <ContentSection id="feedback">
          <DiscussionCta id="feedback-title" title={p.feedbackTitle} body={p.feedbackBody}>
            <FeedbackLinks block={block} labels={w} />
          </DiscussionCta>
        </ContentSection>

        <ContentSection id="others" title={p.others} className="is-last">
          <ul className="ps-tiles">
            {BUILDING_BLOCKS.filter((b) => b.id !== block.id).map((b) => (
              <li key={b.id}>
                <Link href={`/open-source/${b.id}`}>
                  <BlockIcon icon={b.icon} size={20} /> {w.items[b.id].name}
                </Link>
              </li>
            ))}
          </ul>
        </ContentSection>
      </div>

      <SiteFooter />
    </main>
  );
}
