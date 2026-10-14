import { ProductLogo, type BrandId } from "@krizaka/ui";
import { format, getDictionary, type Locale } from "@/lib/i18n";

const MARKS: BrandId[] = ["krizaka", "orazaka", "orochia", "yazakia", "yororis"];
/** The scope each mark wears (the brand's colours), spelled out so the class is a literal. */
const SCOPE: Record<BrandId, string> = { krizaka: "brand-krizaka", orazaka: "brand-orazaka", orochia: "brand-orochia", yazakia: "brand-yazakia", yororis: "brand-yororis" };

/* /docs/ui/brand-marks — the five marks of the Krizaka family, drawn by @krizaka/ui (the same component the products and
   this site's navigation use). Nothing is copied here: the marks are rendered, never re-drawn. */
export function BrandMarksDoc({ locale }: { locale: Locale }) {
  const x = getDictionary(locale).docs.ia.brand;
  return (
    <div>
      <p>{x.intro}</p>
      <ul className="kz-brand-marks not-prose">
        {MARKS.map((id) => (
          <li key={id} className={SCOPE[id]}>
            <ProductLogo id={id} size={96} title={format(x.mark, { name: id.charAt(0).toUpperCase() + id.slice(1), role: x[id] })} />
            <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
            <span className="kz-docs-note">{x[id]}</span>
          </li>
        ))}
      </ul>
      <p className="kz-docs-note">{x.use}</p>
    </div>
  );
}
