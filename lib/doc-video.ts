import { Children, isValidElement, type ReactNode } from "react";

/* A recording in a synced doc is a poster linking to the clip — [![caption](poster.webp)](clip.mp4) — which reads on
   GitHub and becomes the clip itself on the site (app/components/docs/DocVideo.tsx). */

const VIDEO = /\.(mp4|webm)(\?.*)?$/i;

/** The poster and caption of a link that wraps a single image and points to a video, or null. */
export function videoLink(href: string | undefined, children: ReactNode): { src: string; poster: string; caption: string } | null {
  if (!href || !VIDEO.test(href)) return null;
  const only = Children.toArray(children).filter((c) => !(typeof c === "string" && c.trim() === ""));
  if (only.length !== 1 || !isValidElement<{ src?: unknown; alt?: unknown }>(only[0])) return null;
  const { src, alt } = only[0].props;
  if (typeof src !== "string") return null;
  return { src: href, poster: src, caption: typeof alt === "string" ? alt : "" };
}
