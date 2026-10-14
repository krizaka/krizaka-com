import { Section } from "@krizaka/ui/page";
import { JsonLd } from "@/app/components/JsonLd";
import { getDictionary } from "@/lib/i18n";
import { buildFaqJsonLd } from "@/lib/structured-data";
import "./product-faq.css";

type FaqProduct = "krizaka";

/**
 * The questions people ask about Krizaka, answered in the open: native disclosure elements
 * (keyboard operable, no script) and the matching FAQPage JSON-LD — the markup always describes what is on the page.
 * Words: messages → site.faq.<product> (en and fr).
 */
export function ProductFaq({ product, locale }: { readonly product: FaqProduct; readonly locale: string }) {
  const faq = getDictionary(locale).site.faq;
  const items = faq[product];
  return (
    <Section id="faq" eyebrow={faq.eyebrow} title={faq.title} headingSize="sm" divider>
      <JsonLd data={buildFaqJsonLd(items.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="kz-faq">
        {items.map(({ q, a }) => (
          <details key={q} className="kz-faq__item">
            <summary className="kz-faq__q">{q}</summary>
            <p className="kz-faq__a">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
