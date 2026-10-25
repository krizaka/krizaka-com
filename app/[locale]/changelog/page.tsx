import type { Metadata } from "next";
import type { ChangeKind, ChangelogEntry } from "@krizaka/ui/changelog-page";
import { buildAlternates } from "@/lib/seo";
import { asLocale, format, getDictionary } from "@/lib/i18n";
import { anchorOf, changesFor, releaseLabel, type ChangeTag } from "@/lib/changelog";
import { FILTER_IDS } from "@/lib/changelog-filter";
import { PLATFORM, RELEASES } from "@/lib/changelog-data";
import { GITHUB_ORG_URL } from "@/lib/site";
import TopNavBar from "@/app/components/TopNavBar";
import ChangelogView from "@/app/components/ChangelogView";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getDictionary(locale).site.changelog;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { ...buildAlternates(locale, "/changelog"), types: { "application/rss+xml": `/${asLocale(locale)}/changelog/feed.xml` } },
  };
}

/* The template's four kinds carry the five tags: a breaking change is « changed », a security fix « fixed » — their tag
   is said in bold at the head of the line, so nothing is lost. */
const KIND: Record<ChangeTag, ChangeKind> = { feature: "added", change: "changed", fix: "fixed", breaking: "changed", security: "fixed" };

/* /changelog (changelog) — the company's: the highlights of every release of the family, read at build from the release
   data (scripts/gen-changelog.mjs → lib/changelog.json), never written for the page. */
export default async function ChangelogRoute({ params }: Props) {
  const locale = asLocale((await params).locale);
  const c = getDictionary(locale).site.changelog;
  const date = new Intl.DateTimeFormat(c.langTag, { dateStyle: "long", timeZone: "UTC" });

  const entries: (ChangelogEntry & { product: string })[] = RELEASES.map((r) => ({
    id: anchorOf(r),
    product: r.product,
    date: r.date,
    dateLabel: date.format(new Date(`${r.date}T12:00:00Z`)),
    version: r.url ? <a href={r.url}>{releaseLabel(r)}</a> : releaseLabel(r),
    title: r.source,
    changes: changesFor(r, locale).map((ch) => ({
      kind: KIND[ch.tag],
      text: (
        <>
          {(ch.tag === "breaking" || ch.tag === "security") && <b>{c.tags[ch.tag]} · </b>}
          {ch.text}
          {ch.pr && (
            <>
              {" "}
              <a href={ch.pr.url} aria-label={format(c.pull, { number: ch.pr.number })}>
                #{ch.pr.number}
              </a>
            </>
          )}
        </>
      ),
    })),
  }));

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100dvh" }}>
      <TopNavBar />
      <ChangelogView
        back={{ href: "/", label: c.back }}
        eyebrow={c.eyebrow}
        title={c.title}
        lead={
          <>
            {c.lead}
            {PLATFORM.site && (
              <>
                {" "}
                {/* the site's own version, anchored: /changelog#<version> */}
                <span id={PLATFORM.site}>{format(c.runs, { version: PLATFORM.site })}</span>
              </>
            )}
          </>
        }
        feed={{ href: `/${locale}/changelog/feed.xml`, label: c.feed }}
        filterLabel={c.filterLabel}
        allLabel={c.filters.all}
        filterNames={Object.fromEntries(FILTER_IDS.map((id) => [id, c.filters[id]])) as Record<(typeof FILTER_IDS)[number], string>}
        none={c.noneForFilter}
        kindLabels={c.kinds}
        logLabel={c.logLabel}
        entries={entries}
      />
      {entries.length === 0 && (
        <p style={{ margin: "0 auto", maxWidth: "var(--kz-page-max)", padding: "0 var(--kz-page-gutter) 4rem", color: "var(--kz-text-secondary)" }}>
          {c.empty} <a href={`${GITHUB_ORG_URL}/krizaka-ui/releases`}>{c.emptyLink}</a>
        </p>
      )}
    </main>
  );
}
