import { takeOf, TAKE_PRODUCTS } from "@/lib/story-takes";
import { takeVtt } from "@/lib/take-captions";
import { asLocale, getDictionary } from "@/lib/i18n";
import type { ProductId } from "@/lib/products";

// The captions of a take on /story (a recording of a product, a scene the engine rendered), in the page's language:
// same-origin (a <track> from the CDN would need CORS), built once per deployment from the messages: one route for
// every take, /<locale>/story/captions/<product>.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ["en", "fr"].flatMap((locale) => TAKE_PRODUCTS.map((take) => ({ locale, take })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; take: string }> }) {
  const { locale: raw, take } = await params;
  const locale = asLocale(raw);
  const spec = TAKE_PRODUCTS.includes(take as ProductId) ? takeOf(take as ProductId, locale) : null;
  const words = (getDictionary(locale).site.story.products.take.captions as Record<string, readonly string[]>)[take];
  if (!spec || !words) return new Response("Not found", { status: 404 });
  return new Response(takeVtt(spec.cues, words), {
    headers: { "Content-Type": "text/vtt; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
