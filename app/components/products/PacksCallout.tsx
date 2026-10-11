import Link from "next/link";
import { ForwardIcon, PackIcon } from "@krizaka/icons";
import { getDictionary, format, type Locale } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { packText, packTitle, showcasePacks } from "@/lib/orazaka-packs";
import Rich from "@/app/components/Rich";
import ButtonLink from "@/app/components/sections/ButtonLink";

/* The packs, on the Orazaka product page: every pack on the shelf (generated from krizaka/orazaka-packs), each a link
   to its card on /products/orazaka/packages. Words: site.orazakaPacks.callout; the packs' own words are theirs. */
export default function PacksCallout({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).site.orazakaPacks.callout;
  const packs = showcasePacks();
  const studios = packs.reduce((n, p) => n + p.studios.length, 0);
  return (
    <section id="packs" className="bp-wrap" style={{ scrollMarginTop: 72 }}>
      <div className="bp-center" {...reveal()}>
        <p className="bp-eyebrow">
          <PackIcon size={18} nodeColor="var(--kz-accent)" /> {t.eyebrow}
        </p>
        <h2 className="bp-h2"><Rich text={t.title} /></h2>
        <p className="bp-lead">{format(t.body, { packs: packs.length, studios })}</p>
      </div>
      <ul className="bp-cards">
        {packs.map((p, i) => (
          <li key={p.key} className="bp-card" style={{ listStyle: "none" }} {...reveal(i + 1)}>
            <h3>{packTitle(p, locale)}</h3>
            <p>{packText(p.text, locale).tagline ?? packText(p.studios[0]?.text ?? {}, locale).tagline}</p>
            <Link href={`/products/orazaka/packages#pack-${p.key}`} className="bp-card-more">
              {p.studios.length === 1 ? t.studiosOne : format(t.studios, { count: p.studios.length })} <ForwardIcon size={14} />
            </Link>
          </li>
        ))}
      </ul>
      <div className="bp-actions bp-center" style={{ justifyContent: "center" }} {...reveal()}>
        <ButtonLink href="/products/orazaka/packages" variant="primary" size="lg">
          {t.cta} <ForwardIcon size={16} />
        </ButtonLink>
      </div>
    </section>
  );
}
