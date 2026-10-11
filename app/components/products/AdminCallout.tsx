import { CheckIcon, ForwardIcon, SettingsIcon } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { getDictionary, type Locale } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import Rich from "@/app/components/Rich";
import ButtonLink from "@/app/components/sections/ButtonLink";

/* "What you control": a product's administration console, on its product page, linking to its documentation
   (the generated /docs/orazaka/admin, the synced /docs/orochia/admin_console). Words: site.adminCallout.<product>. */
const DOCS = { orazaka: "/docs/orazaka/admin", orochia: "/docs/orochia/admin_console" } as const;

export default function AdminCallout({ product, locale }: { product: keyof typeof DOCS; locale: Locale }) {
  const t = getDictionary(locale).site.adminCallout[product];
  return (
    <SectionBackdrop className="bp-glide" dome={false} id="control">
      <div className="bp-wrap bp-split" style={{ alignItems: "start" }}>
        <div {...reveal()}>
          <p className="bp-eyebrow">
            <SettingsIcon size={18} nodeColor="var(--kz-accent)" /> {t.eyebrow}
          </p>
          <h2 className="bp-h2"><Rich text={t.title} /></h2>
          <p className="bp-lead">{t.body}</p>
          <div className="bp-actions">
            <ButtonLink href={DOCS[product]} size="lg">
              {t.cta} <ForwardIcon size={16} />
            </ButtonLink>
          </div>
        </div>
        <ul className="bp-proofs" style={{ marginTop: 0 }} {...reveal(1)}>
          {t.points.map((point) => (
            <li key={point.title} className="bp-proof">
              <CheckIcon size={18} />
              <span>
                <strong>{point.title}</strong> {point.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SectionBackdrop>
  );
}
