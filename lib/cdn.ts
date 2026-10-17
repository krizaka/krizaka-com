/* The site's media — product tours, the gallery, the home backdrop — live on Bunny (the krizaka-assets storage zone,
   under site/), never in the repository. scripts/cdn-assets.mjs uploads a file as `<name>.<hash>.<ext>` and records
   its hash in lib/cdn-manifest.json; this module turns a logical path (`products/orochia/tour/alex-bid.mp4`) into that
   URL. A URL never changes content, so the CDN and browsers may keep it as long as they like.

   NEXT_PUBLIC_MEDIA_CDN_URL switches the host (a custom hostname later) without touching the code; it is read at build time.
   Same-origin on purpose: the favicon (app/manifest, the tab) and what Next.js generates (robots, sitemap, llms.txt,
   /_next/static, the fonts of @krizaka/fonts). */

import manifest from "./cdn-manifest.json";

export const CDN_URL = (process.env.NEXT_PUBLIC_MEDIA_CDN_URL || "https://krizaka-assets.b-cdn.net").replace(/\/+$/, "");

const FILES: Record<string, string> = manifest.files;

/** `products/orochia/tour/alex-bid.mp4` → `https://…/site/products/orochia/tour/alex-bid.<hash>.mp4`. */
export function cdn(path: string): string {
  const hash = FILES[path];
  if (!hash) throw new Error(`${path} is not on the CDN — upload it: node scripts/cdn-assets.mjs upload <file> --to ${path.replace(/\/[^/]+$/, "")}`);
  const dot = path.lastIndexOf(".");
  return `${CDN_URL}/${manifest.root}/${path.slice(0, dot)}.${hash}${path.slice(dot)}`;
}

/** True when `path` is recorded in the manifest (a medium that may not be uploaded yet: the page then does without it). */
export const onCdn = (path: string): boolean => Boolean(FILES[path]);

/** A recording: the two encodings and its poster, recorded together (`<base>.webm|.mp4|.jpg`). */
export interface Video {
  webm: string;
  mp4: string;
  poster: string;
}

export const video = (base: string): Video => ({ webm: cdn(`${base}.webm`), mp4: cdn(`${base}.mp4`), poster: cdn(`${base}.jpg`) });

/** Where the media were served before they moved to Bunny (`/assets/…` on krizaka.com) — published examples of
    @krizaka/ui still point there (the three Orochia clips of its video examples): next.config answers each old URL with a
    redirect to its file on the CDN. They were recorded on the old interface: the redirect now serves the current English recordings
    (products/orochia/tour/en/; Orochia's own site picks its language's set, en/ or fr/). */
const LEGACY: [from: string, to: string][] = [["/assets/orochia/tour/", "products/orochia/tour/en/"]];

export function legacyRedirects(): { source: string; destination: string }[] {
  return LEGACY.flatMap(([from, to]) =>
    Object.keys(FILES)
      .filter((path) => path.startsWith(to))
      .map((path) => ({ source: from + path.slice(to.length), destination: cdn(path) })),
  );
}
