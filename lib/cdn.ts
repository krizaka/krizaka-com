/* The site's media — product tours, the gallery, the home backdrop — live on Bunny (the krizaka-assets storage zone,
   under sites/, layout v2 of ADR-014), never in the repository. scripts/cdn-assets.mjs uploads a file as `<name>.<hash>.<ext>` and records
   its hash in lib/cdn-manifest.json; this module turns a logical path (`products/orazaka/tour/tea-pour.mp4`) into that
   URL. A URL never changes content, so the CDN and browsers may keep it as long as they like.

   NEXT_PUBLIC_MEDIA_CDN_URL switches the host (a custom hostname later) without touching the code; it is read at build time.
   Same-origin on purpose: the favicon (app/manifest, the tab) and what Next.js generates (robots, sitemap, llms.txt,
   /_next/static, the fonts of @krizaka/fonts). */

import { manifestObject } from "../scripts/bunny-layout.mjs";
import manifest from "./cdn-manifest.json";

export const CDN_URL = (process.env.NEXT_PUBLIC_MEDIA_CDN_URL || "https://krizaka-assets.b-cdn.net").replace(
  /\/+$/,
  "",
);

const FILES: Record<string, string> = manifest.files;

const versioned = (path: string, hash: string): string => {
  const dot = path.lastIndexOf(".");
  return `${path.slice(0, dot)}.${hash}${path.slice(dot)}`;
};

/** `products/orazaka/tour/tea-pour.mp4` → `https://…/sites/orazaka/tour/tea-pour.<hash>.mp4`. */
export function cdn(path: string): string {
  const hash = FILES[path];
  if (!hash)
    throw new Error(
      `${path} is not on the CDN — upload it: node scripts/cdn-assets.mjs upload <file> --to ${path.replace(/\/[^/]+$/, "")}`,
    );
  // Layout v2 (ADR-014): `home/…` → sites/www/home/…, `products/<p>/…` → sites/<p>/…, `brand-films/…` → org/v1/films/….
  return `${CDN_URL}/${manifestObject(manifest.root, path, hash, versioned)}`;
}

/** True when `path` is recorded in the manifest (a medium that may not be uploaded yet: the page then does without it). */
export const onCdn = (path: string): boolean => Boolean(FILES[path]);

/** A recording: the two encodings and its poster, recorded together (`<base>.webm|.mp4|.jpg`). */
export interface Video {
  webm: string;
  mp4: string;
  poster: string;
}

export const video = (base: string): Video => ({
  webm: cdn(`${base}.webm`),
  mp4: cdn(`${base}.mp4`),
  poster: cdn(`${base}.jpg`),
});
