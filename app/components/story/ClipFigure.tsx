/* A chapter's clip on /story (lib/story-clips.ts, krizaka-internal#2800): the home's plate — a 1 px rule, square corners,
   the paper's solid offset shadow — holding the clip's poster, which reserves the 16:9 frame and carries the text
   alternative, and over it @krizaka/ui's PausableLoop: muted, looped, playsinline, mounted after the page's load, paused
   off screen and by its visible button, absent under reduced motion or Save-Data (the poster stays). Under the plate, its
   caption in the typewriter face (« Fig. 4 — … »), then what the chapter adds (the film's way in). The words are the
   carousel's own (site.home.showcase.slides.<carousel>.<id>). A server component; only the loop runs in the browser. */

import type { ReactNode } from "react";
import Image from "next/image";
import { PausableLoop } from "@krizaka/ui/pausable-loop";
import { onCdn, video } from "@/lib/cdn";
import { format, getDictionary } from "@/lib/i18n";
import { clipBase, storyClipProblems, type ClipRef } from "@/lib/story-clips";

// A retired or unknown slide, or a file the manifest does not know, fails the build.
const problems = storyClipProblems(onCdn);
if (problems.length > 0) {
  throw new Error(`story clips: ${problems.join("; ")}`);
}

export default function ClipFigure({
  clip,
  fig,
  locale,
  children,
}: Readonly<{
  clip: ClipRef;
  /** The figure's number: the chapter's. */
  fig: number;
  locale: string;
  /** Under the caption: what the chapter adds to its figure. */
  children?: ReactNode;
}>) {
  const t = getDictionary(locale).site;
  const words = (t.home.showcase.slides[clip.carousel] as Record<string, { caption: string; alt: string }>)[clip.id];
  const files = video(clipBase(clip));
  return (
    <figure className="st-clip" data-clip={`${clip.carousel}/${clip.id}`}>
      <div className="rd-plate st-clip-plate">
        <Image
          className="st-clip-media"
          src={files.poster}
          alt={words.alt}
          width={1280}
          height={720}
          sizes="(min-width: 1100px) 440px, 92vw"
        />
        <PausableLoop
          sources={{ webm: files.webm, mp4: files.mp4 }}
          poster={files.poster}
          labels={{ pause: t.story.clips.pause, play: t.story.clips.play }}
          className="st-clip-media"
        />
      </div>
      <figcaption className="rd-plate-caption">
        {format(t.home.showcase.labels.figure, { fig: String(fig), caption: words.caption })}
      </figcaption>
      {children}
    </figure>
  );
}
