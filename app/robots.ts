import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI crawlers we explicitly welcome, so Krizaka/Orazaka can be cited as a source
 * in AI answers — Google AI Overviews/Gemini (Google-Extended), ChatGPT
 * (GPTBot/OAI-SearchBot), Perplexity, Claude, Apple Intelligence, Common Crawl.
 * The goal here is maximum citation surface, not content protection.
 */
const AI_CRAWLERS = [
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  // Only non-indexable API routes are blocked. /_next/ is intentionally NOT
  // disallowed: Googlebot must fetch the JS/CSS chunks to render the page and
  // score Core Web Vitals — blocking them suppresses rankings.
  const disallow = ["/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
