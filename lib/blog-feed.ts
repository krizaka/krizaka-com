/* The feed of the company blog (RSS 2.0), parsed — pure, no import, tested by tests/blog.test.mjs. */

export interface BlogPost {
  title: string;
  description: string;
  url: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
}

const decode = (s: string) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, "&").trim();
const field = (item: string, tag: string) => decode(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(item)?.[1] ?? "");

/** The items of an RSS 2.0 feed, newest first, at most `limit`. Only links on `host` (the blog's origin) are kept. */
export function parseFeed(xml: string, host: string, limit = 3): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const url = field(item, "link");
    const when = new Date(field(item, "pubDate"));
    if (!url.startsWith(`${host}/`) || Number.isNaN(when.getTime())) continue;
    posts.push({ title: field(item, "title"), description: field(item, "description"), url, date: when.toISOString().slice(0, 10) });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
