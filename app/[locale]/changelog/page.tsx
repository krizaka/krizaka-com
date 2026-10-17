import type { Metadata } from "next";
import Link from "next/link";
import { ChangelogPage, type ChangeKind, type ChangelogEntry } from "@krizaka/ui/changelog-page";
import { buildAlternates } from "@/lib/seo";
import { asLocale, format, getDictionary } from "@/lib/i18n";
import { anchorOf, type ChangeTag } from "@/lib/changelog";
import { PLATFORM, RELEASES } from "@/lib/changelog-data";
import { GITHUB_ORG_URL } from "@/lib/site";
import TopNavBar from "@/app/components/TopNavBar";
import ButtonLink from "@/app/components/ButtonLink";

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

  const entries: ChangelogEntry[] = RELEASES.map((r) => ({
    id: anchorOf(r),
    date: r.date,
    dateLabel: date.format(new Date(`${r.date}T12:00:00Z`)),
    version: r.url ? <a href={r.url}>{`${r.source} ${r.version}`}</a> : `${r.source} ${r.version}`,
    title: r.source,
    changes: r.changes.map((ch) => ({
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
      <ChangelogPage
        back={{ href: "/", label: c.back }}
        linkAs={Link}
        eyebrow={c.eyebrow}
        title={c.title}
        lead={
          <>
            {c.lead}
            {PLATFORM.site && (
              <>
                {" "}
                {/* the footer's link lands here: /changelog#<version> */}
                <span id={PLATFORM.site}>{format(c.runs, { version: PLATFORM.site, ui: PLATFORM.ui })}</span>
              </>
            )}
          </>
        }
        actions={<ButtonLink href={`/${locale}/changelog/feed.xml`} variant="secondary" size="md">{c.feed}</ButtonLink>}
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
