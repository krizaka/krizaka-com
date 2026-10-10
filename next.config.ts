import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";
import { DOCS_MANIFEST } from "./lib/docs-manifest";

/**
 * Security headers applied to every route. Kept deliberately CSP-free for now —
 * a strict Content-Security-Policy needs per-request nonces wired through the
 * App Router and is a separate, higher-risk change. These are the zero-risk,
 * high-signal headers (HSTS, nosniff, framing, referrer, permissions).
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Crawl/CWV hygiene.
  poweredByHeader: false,
  compress: true, // Vercel adds Brotli at the edge; this covers other runtimes.
  reactStrictMode: true,

  // Serve next-gen formats first; AVIF → WebP → original. Cache optimized images
  // for a year (LCP wins; bytes only re-fetched when the source URL changes).
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  // The product docs moved to the documentation (/docs/<product>/<slug>, Fumadocs): the old article URLs answer 301.
  async redirects() {
    const categories = [...new Set(Object.values(DOCS_MANIFEST).map((doc) => doc.category))].join("|");
    return [
      {
        source: `/:locale(fr|en)/products/orazaka/:category(${categories})/:slug`,
        destination: "/:locale/docs/orazaka/:slug",
        statusCode: 301,
      },
      { source: "/:locale(fr|en)/products/orochia/docs/:slug", destination: "/:locale/docs/orochia/:slug", statusCode: 301 },
    ];
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Static media in /public: cache hard but allow background revalidation.
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // AI/agent + crawl assets: short cache, always revalidate.
        source: "/:file(llms.txt|llms-full.txt)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
    ];
  },
};

/* Fumadocs: compiles the collections of source.config.ts into .source/ (content/docs, the synced product docs). */
const withMDX = createMDX();

export default withMDX(nextConfig);
