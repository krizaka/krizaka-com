/* « How we build » (krizaka-internal#4111, words of krizaka-internal#3122): Krizaka Agents, the technology the products are
   built with, folded into its card of the Products section (krizaka-internal#4183), last after the offers. Its name and address are the org's
   (`family` of @krizaka/org, which holds the private members): never an address typed here. */
import { family } from "@krizaka/org";

export const AGENTS_ID = "agents";
/** The proper noun, used only until the org publishes the `agents` member. */
const FALLBACK_NAME = "Krizaka Agents";
const BLOG = "https://blog.krizaka.com";

/** The blog chapters about building with agents: the slug is the blog's route, the words are `site.home.howWeBuild.chapters.<id>`. */
export const AGENT_CHAPTERS = [
  { id: "building", slug: "building-with-agents" },
  { id: "coordinator", slug: "agents-under-a-coordinator" },
  { id: "rules", slug: "working-with-agents-rules-that-refuse" },
  { id: "architecture", slug: "the-architecture-of-krizaka-agents" },
] as const;

/** The blog's own routing: English at the root, French under /fr. */
const LOCALE_PREFIX: Record<string, string> = { en: "", fr: "/fr" };

export type AgentChapterId = (typeof AGENT_CHAPTERS)[number]["id"];

/** A chapter's address on the blog, in the visitor's language (French is under /fr, the blog's own routing). */
export function chapterUrl(slug: string, locale: string): string {
  return `${BLOG}${LOCALE_PREFIX[locale] ?? ""}/story/${slug}/`;
}

type Member = (typeof family)[number];

export function howWeBuild(members: readonly Member[] = family) {
  const m = members.find((x) => x.id === AGENTS_ID);
  return {
    name: m?.name ?? FALLBACK_NAME,
    // The org's address (private members included, `family`), never typed here and never the repository: no source here.
    siteUrl: m?.urls.site ?? "",
  };
}
