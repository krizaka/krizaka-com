/* "From the blog" — the three latest posts of blog.krizaka.com, read at build from its feed (lib/blog-posts.ts). Nothing
   is rendered until the blog has published a post. One LinkCard each, the blog's address, never a copy of the text. */

import { ForwardIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Section } from "@krizaka/ui/page";
import { BLOG_PREFIX, latestPosts } from "@/lib/blog-posts";
import { getDictionary } from "@/lib/i18n";
import { BLOG_URL } from "@/lib/site";

const DATE_LOCALE: Record<string, string> = { en: "en-CA", fr: "fr-CA" };

export default async function LatestPosts({ locale }: { locale: string }) {
  const posts = await latestPosts(locale);
  if (!posts.length) return null;
  const b = getDictionary(locale).site.home.blog;
  const fmt = new Intl.DateTimeFormat(DATE_LOCALE[locale] ?? "en-CA", { dateStyle: "long", timeZone: "UTC" });
  return (
    <Section
      id="blog"
      eyebrow={b.eyebrow}
      title={b.title}
      lead={b.lead}
      reveal
      divider
      actions={
        <a href={`${BLOG_URL}${BLOG_PREFIX[locale] ?? ""}/`} className="kz-link-strong">
          {b.all} <ForwardIcon size={15} />
        </a>
      }
    >
      <CardGrid min={280}>
        {posts.map((p) => (
          <LinkCard key={p.url} href={p.url} meta={fmt.format(new Date(`${p.date}T12:00:00Z`))} title={p.title} description={p.description} titleAs="h3" layout="stack" />
        ))}
      </CardGrid>
    </Section>
  );
}
