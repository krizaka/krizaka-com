/* Props the site gives to some live examples of /docs/ui. The registry's examples hold no media of their own (a clip is the
   product's): the site passes Krizaka's own AI-generated clips from the CDN (fictional, owned by Krizaka), so the demo plays
   what a product would. Keyed like the import map (`lib/ui-examples.ts`). */
import { cdn } from "@/lib/cdn";

const clip = () => ({ src: cdn("home/kit/challenge-v.mp4"), poster: cdn("home/kit/challenge-v.jpg") });

export const EXAMPLE_PROPS: Record<string, () => Record<string, unknown>> = {
  "vertical-video/rail": clip,
  "vertical-video/feed": () => ({ src: clip().src }),
};

/** The props of an example, or none. */
export const examplePropsOf = (key: string): Record<string, unknown> => EXAMPLE_PROPS[key]?.() ?? {};
