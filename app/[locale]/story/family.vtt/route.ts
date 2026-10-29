import { captionHandler, captionLocales } from "@/lib/caption-route";
import { FAMILY_CUES } from "@/lib/film-captions";

// The captions of « The Krizaka family » (/story), in the page's language: same-origin, built once per deployment.
export const dynamic = "force-static";
export const generateStaticParams = captionLocales;
export const GET = captionHandler((d) => d.site.story.world.family.cues, FAMILY_CUES);
