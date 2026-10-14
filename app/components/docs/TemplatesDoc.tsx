import Link from "next/link";
import type { TOCItemType } from "fumadocs-core/toc";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { templateEntries, templatePurposes } from "@/lib/ui-foundations";
import { templatePurposeSlug } from "@/lib/ui-ia";
import type { TemplatePurpose } from "@/lib/ui-registry";
import { ExamplePreview, NativeExamplePreview } from "./ExamplePreview";

const anchor = (component: string, example: string) => `${component}-${example}`;

/** The contents of /docs/ui/templates (one entry per intent) and of /docs/ui/templates-<intent> (one per template). */
export function templatesToc(t: TranslationDictionary, purpose?: TemplatePurpose): TOCItemType[] {
  if (purpose) return templateEntries(purpose).map(({ item, example }) => ({ title: example.title, url: `#${anchor(item.name, example.name)}`, depth: 2 }));
  return templatePurposes().map(({ id }) => ({ title: t.docs.ia.purposes[id].title, url: `#${id}`, depth: 2 }));
}

/* /docs/ui/templates and /docs/ui/templates-<intent> — the templates of @krizaka/ui (an example of a component flagged
   `template`, web or React Native), grouped by the intent that brings a reader to them. Generated from the registry like
   the components' pages: never written here. Each template says why its layout is what it is. */
export function TemplatesDoc({ locale, purpose }: { locale: Locale; purpose?: TemplatePurpose }) {
  const t: TranslationDictionary = getDictionary(locale);
  const w = t.docs.screens;
  const x = t.docs.ia.templates;
  const purposes = templatePurposes();

  if (!purpose) {
    return (
      <div className="kz-screens">
        <p>{x.overviewLead}</p>
        {purposes.map(({ id }) => {
          const entries = templateEntries(id);
          const words = t.docs.ia.purposes[id];
          return (
            <section key={id} aria-labelledby={id}>
              <h2 id={id}>{words.title}</h2>
              <p className="kz-docs-note">{words.when}</p>
              <ul>
                {entries.map(({ item, example, platform, why }) => (
                  <li key={anchor(item.name, example.name) + platform}>
                    <Link href={`/${locale}/docs/ui/${templatePurposeSlug(id)}#${anchor(item.name, example.name)}`}>{example.title}</Link>
                    {platform === "native" ? ` (${x.native})` : ""} — {why}
                  </li>
                ))}
              </ul>
              <p className="kz-docs-note">
                <Link href={`/${locale}/docs/ui/${templatePurposeSlug(id)}`}>{format(x.open, { intent: words.title })} →</Link> · {format(x.count, { count: entries.length })}
              </p>
            </section>
          );
        })}
      </div>
    );
  }

  const entries = templateEntries(purpose);
  return (
    <div className="kz-screens">
      <p className="kz-docs-note">{w.phone}</p>
      {entries.map(({ item, example, platform, why }) => (
        <section key={anchor(item.name, example.name)} aria-labelledby={anchor(item.name, example.name)}>
          <h2 id={anchor(item.name, example.name)}>{example.title}</h2>
          <p>{example.description}</p>
          <p>
            <strong>{x.whyLayout}.</strong> {why}{" "}
            <span className="kz-docs-note">
              {w.layout} <Link href={`/${locale}/docs/ui/${item.name}`}>{item.title}</Link>
              {platform === "native" ? ` · ${x.native}` : ""}
            </span>
          </p>
          {platform === "native" ? (
            <NativeExamplePreview title={item.title} example={example} locale={locale} />
          ) : (
            <ExamplePreview title={item.title} example={example} locale={locale} />
          )}
        </section>
      ))}
    </div>
  );
}
