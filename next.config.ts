import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";
import { DOCS_MANIFEST } from "./lib/docs-manifest";
import { CDN_URL, legacyRedirects } from "./lib/cdn";

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
    // geolocation on this origin only: the map examples' "Near me" (asked on a press, never on load).
    value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // A self-contained server (.next/standalone/server.js + the traced node_modules) for the container image
  // (Dockerfile, DigitalOcean App Platform). Vercel ignores it and keeps building its own output.
  output: "standalone",

  // Crawl/CWV hygiene.
  poweredByHeader: false,
  compress: true, // gzip from the Node server; the edge in front (Vercel, App Platform's CDN) may add Brotli.
  reactStrictMode: true,

  // The product kits ship their registry examples as TypeScript sources (and Orazaka's kit its whole source):
  // /docs/<product>/ui renders them live.
  transpilePackages: ["@krizaka/orazaka-design-system", "@krizaka/orazaka-shared", "@krizaka/orochia-design-system"],

  // Serve WebP (or the original). Cache optimized images
  // for a year (LCP wins; bytes only re-fetched when the source URL changes).
  // The media live on Bunny (lib/cdn.ts): next/image fetches them from there and serves their responsive sizes — the
  // gallery (site/…) and the screenshots the synced docs embed (pr-assets/…).
  images: {
    // WebP only: AVIF encoding is several times slower and the app runs on one shared vCPU (DigitalOcean).
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [{ protocol: "https", hostname: new URL(CDN_URL).hostname, port: "", pathname: "/**", search: "" }],
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
      // The automation page described the pre-split topology; jobs, schedules and automation are one generated page now.
      { source: "/:locale(fr|en)/docs/orazaka/automation", destination: "/:locale/docs/orazaka/jobs", statusCode: 301 },
      // The media left /public for Bunny: an old /assets/… URL (published @krizaka/ui examples) answers with its file on
      // the CDN. Temporary, because the destination is versioned — a new recording gets a new URL.
      ...legacyRedirects().map((r) => ({ ...r, permanent: false })),
    ];
  },

  // The maps of /docs/ui read their tiles and glyphs (Protomaps PMTiles, Noto Sans) through this origin: the CDN's
  // files, proxied with their byte ranges — no cross-origin request (app/components/docs/MapAssets.tsx).
  async rewrites() {
    return [{ source: "/maps/v1/:path*", destination: `${CDN_URL}/maps/v1/:path*` }];
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
