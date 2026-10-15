import type { NextConfig } from "next";
import { javaRedirects } from "./lib/java-redirects";
import { uiRedirects } from "./lib/ui-redirects";
import { productRedirects } from "./lib/product-redirects";
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

  // The products moved to their own sites (lib/product-redirects.ts): every old page, demo and documentation address
  // answers 308 with the product's site.
  async redirects() {
    return [
      ...productRedirects(),
      // Krizaka Java's documentation is java.krizaka.com (lib/java-redirects.ts).
      ...javaRedirects(),
      // Krizaka UI's documentation is ui.krizaka.com, built from krizaka-ui (lib/ui-redirects.ts); /docs goes to /open-source.
      ...uiRedirects(),
      // The media left /public for Bunny: an old /assets/… URL (published @krizaka/ui examples) answers with its file on
      // the CDN. Temporary, because the destination is versioned — a new recording gets a new URL.
      ...legacyRedirects().map((r) => ({ ...r, permanent: false })),
    ];
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Pages (HTML, RSC payloads) must revalidate: Next.js marks prerendered pages `s-maxage=1y`, which kept a
        // deployed change invisible for a year at the edge. Only the hashed bundles under /_next/static are immutable.
        // Declared before the media rule below, which wins for its own files.
        source: "/((?!_next/static/|_next/image).*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
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

export default nextConfig;
