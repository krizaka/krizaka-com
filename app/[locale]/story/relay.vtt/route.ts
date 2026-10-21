import { filmVtt, RELAY_CUES } from "@/lib/film-captions";
import { asLocale, getDictionary } from "@/lib/i18n";

// The captions of « Le monde de Krizaka : le relais » (/story and the home), in the page's language: same-origin (a <track> from the CDN would
// need CORS), built once per deployment from the messages.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const words = getDictionary(asLocale((await params).locale)).site.story.world.relay.cues;
  return new Response(filmVtt(words, RELAY_CUES), { headers: { "Content-Type": "text/vtt; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
