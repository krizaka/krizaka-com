import { captionHandler, captionLocales } from "@/lib/caption-route";
import { RELAY_CUES } from "@/lib/film-captions";

// The captions of « Le monde de Krizaka : le relais » (/story and the home), in the page's language: same-origin, built once per deployment.
export const dynamic = "force-static";
export const generateStaticParams = captionLocales;
export const GET = captionHandler((d) => d.site.story.world.relay.cues, RELAY_CUES);
