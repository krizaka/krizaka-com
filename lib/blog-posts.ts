/* The latest posts of the company blog, read at build from its feed (https://blog.krizaka.com/feed.xml, /fr/feed.xml) —
   never fetched in the browser. While the blog has no published post (or is unreachable) the list is empty and the home
   shows nothing: no placeholder, no invented post. */
import { parseFeed, type BlogPost } from "./blog-feed";
import { BLOG_URL } from "./site";

export type { BlogPost };

/** The blog's path prefix of a language: English at the root, French under /fr (a map, never a ternary on the locale). */
export const BLOG_PREFIX: Record<string, string> = { en: "", fr: "/fr" };

/** The latest posts in a language, or [] (the blog is not open yet, or does not answer: the build never fails on it). */
export async function latestPosts(locale: string, limit = 3): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BLOG_URL}${BLOG_PREFIX[locale] ?? ""}/feed.xml`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    return parseFeed(await res.text(), BLOG_URL, limit);
  } catch {
    return [];
  }
}
