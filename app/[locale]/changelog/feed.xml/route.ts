import { asLocale, getDictionary } from "@/lib/i18n";
import { changelogRss } from "@/lib/changelog";
import { RELEASES } from "@/lib/changelog-data";
import { SITE_URL } from "@/lib/site";

// The changelog as RSS 2.0, in the page's language, built once per deployment from the same release data as the page.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const c = getDictionary(locale).site.changelog;
  const xml = changelogRss({
    releases: RELEASES,
    title: c.feedTitle,
    description: c.feedDescription,
    siteUrl: SITE_URL,
    pageUrl: `${SITE_URL}/${locale}/changelog`,
    feedUrl: `${SITE_URL}/${locale}/changelog/feed.xml`,
    language: c.langTag,
    lang: locale,
    tagLabel: c.tags,
  });
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
