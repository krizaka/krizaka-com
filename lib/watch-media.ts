/* The files a watch page plays and the sitemap lists: a film's web cut and its poster, as CDN URLs (lib/cdn.ts fails the
   build on a path the manifest does not know). Apart from lib/watch-films.ts so that next.config.ts, which reads the
   redirects there, never loads the manifest. */

import { cdn, video } from "./cdn.ts";
import { WatchKind, type WatchFilm } from "./watch-films.ts";

export const watchMedia = (f: WatchFilm): { mp4: string; poster: string } => {
  if (f.kind === WatchKind.Brand) {
    const v = video(f.base);
    return { mp4: v.mp4, poster: v.poster };
  }
  return { mp4: cdn(f.mp4), poster: cdn(f.poster) };
};
