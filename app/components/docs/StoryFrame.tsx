"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { STORYBOOK_URL } from "@/lib/site";
import { format } from "@/lib/i18n";
import { useTheme } from "../ThemeProvider";
import { useI18n } from "../I18nProvider";

/** Message a Storybook preview may post to size its frame: `{ type: "krizaka:story-height", id, height }`. */
const HEIGHT_MESSAGE = "krizaka:story-height";
const STORYBOOK_ORIGIN = new URL(STORYBOOK_URL).origin;

/* A Storybook story embedded as tested (study §4.3): the published Storybook in an iframe, in the page's theme.
   Height: a sensible default, adjusted when the Storybook posts its height; the iframe loads lazily. */
export function StoryFrame({ story, height = 320 }: { story: string; height?: number }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [frameHeight, setFrameHeight] = useState(height);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== STORYBOOK_ORIGIN || event.source !== frame.current?.contentWindow) return;
      const data = event.data as { type?: string; height?: number } | null;
      if (data?.type === HEIGHT_MESSAGE && typeof data.height === "number" && data.height > 0) {
        setFrameHeight(Math.min(Math.ceil(data.height), 1600));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const params = new URLSearchParams({ id: story, viewMode: "story", globals: `theme:${theme}` });
  const title = format(t.docs.story.title, { story });
  return (
    <figure className="kz-story not-prose">
      <iframe
        ref={frame}
        src={`${STORYBOOK_URL}/iframe.html?${params}`}
        title={title}
        loading="lazy"
        style={{ height: frameHeight }}
        className="kz-story-frame"
      />
      <figcaption className="kz-story-caption">
        <code>{story}</code>
        <a href={`${STORYBOOK_URL}/?path=/story/${story}`} target="_blank" rel="noreferrer">
          {t.docs.story.open} <ExternalLink size={12} aria-hidden />
        </a>
      </figcaption>
    </figure>
  );
}
