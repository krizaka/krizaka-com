import { captionHandler, captionLocales } from "@/lib/caption-route";

// The captions of « Le monde de Krizaka » (/story), in the page's language: same-origin (a <track> from the CDN would
// need CORS), built once per deployment from the messages.
export const dynamic = "force-static";
export const generateStaticParams = captionLocales;
export const GET = captionHandler((d) => d.site.story.world.cues);
