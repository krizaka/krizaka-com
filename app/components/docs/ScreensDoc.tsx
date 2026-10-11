import Link from "next/link";
import type { TOCItemType } from "fumadocs-core/toc";
import { getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { templateEntries } from "@/lib/ui-foundations";
import { ExamplePreview } from "./ExamplePreview";

const anchor = (layout: string, example: string) => `${layout}-${example}`;

/** The contents of /docs/ui/screens: one entry per template. */
export function screensToc(): TOCItemType[] {
  return templateEntries().map(({ item, example }) => ({ title: example.title, url: `#${anchor(item.name, example.name)}`, depth: 2 }));
}

/* /docs/ui/screens — every screen of @krizaka/ui (an example of a layout flagged `template`), live with its code:
   whole screens of the products, generated from the registry like the components' pages — never written here. */
export function ScreensDoc({ locale }: { locale: Locale }) {
  const t: TranslationDictionary = getDictionary(locale);
  const w = t.docs.screens;
  return (
    <div className="kz-screens">
      <p>{w.intro}</p>
      <p className="kz-docs-note">{w.phone}</p>
      {templateEntries().map(({ item, example }) => (
        <section key={anchor(item.name, example.name)} aria-labelledby={anchor(item.name, example.name)}>
          <h2 id={anchor(item.name, example.name)}>{example.title}</h2>
          <p>
            {example.description}{" "}
            <span className="kz-docs-note">
              {w.layout} <Link href={`/${locale}/docs/ui/${item.name}`}>{item.title}</Link>
            </span>
          </p>
          <ExamplePreview title={item.title} example={example} locale={locale} />
        </section>
      ))}
    </div>
  );
}
