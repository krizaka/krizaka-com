import type { ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, MonitorSmartphone, Smartphone, Monitor, XCircle } from "lucide-react";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type { TOCItemType } from "fumadocs-core/toc";
import Rich from "@/app/components/Rich";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { KRIZAKA_UI_REPO_URL } from "@/lib/site";
import { getRegistryIndex, getRegistryItem, type Platform, type RegistryItem } from "@/lib/ui-registry";
import { CodeBlock, ExamplePreview, NativeExamplePreview } from "./ExamplePreview";
import { InlineCode } from "./InlineCode";
import { PropsTable } from "./PropsTable";

/* A /docs/ui/<name> page, generated from the @krizaka/ui registry — the component's code drives every word of it:
   its meta.ts (summary, when to use and not, best practices, accessibility, platforms, status, related), its named
   examples (rendered live, code to copy, web and React Native) and the props of its types. The page chrome is in
   messages; the documentation itself is English, as written in the code. Server Component. */

const PLATFORM_ICON = { web: Monitor, native: Smartphone, both: MonitorSmartphone } satisfies Record<Platform, unknown>;

const WEB_INSTALL = "npm install @krizaka/ui@beta @krizaka/tailwind@beta @krizaka/tokens@beta tailwindcss";
const WEB_CSS = `@import "tailwindcss";
@import "@krizaka/tailwind";
@import "@krizaka/ui/tailwind.css";`;
const NATIVE_INSTALL = "npx expo install react-native-svg\nnpm install @krizaka/ui@beta";

/** Where the documentation of a component is written: its meta.ts in krizaka-ui. */
export function metaSourceUrl(item: RegistryItem): string {
  const file = item.type === "native" ? `src/native/meta/${item.name}.ts` : item.name === "cn" ? "src/cn.meta.ts" : `src/${item.name}/meta.ts`;
  return `${KRIZAKA_UI_REPO_URL}/blob/main/packages/ui/${file}`;
}

/** The table of contents of a component page, in the reader's language. */
export function componentToc(name: string, t: TranslationDictionary, hasNotes: boolean): TOCItemType[] {
  const item = getRegistryItem(name);
  const c = t.docs.component;
  const entries: [string, string | false][] = [
    ["when-to-use", c.whenToUse],
    ["installation", c.installation],
    ["examples", c.examples],
    ["props", c.props],
    ["accessibility", c.accessibility],
    ["best-practices", c.bestPractices],
    ["notes", hasNotes && c.notes],
    ["related", item.related.length > 0 && c.related],
  ];
  return entries.filter(([, title]) => title).map(([id, title]) => ({ title, url: `#${id}`, depth: 2 }));
}

export function PlatformBadges({ item, t }: { item: Pick<RegistryItem, "platforms" | "status" | "category">; t: TranslationDictionary }) {
  const c = t.docs.component;
  const Icon = PLATFORM_ICON[item.platforms];
  return (
    <>
      <span className="kz-chip-meta" data-tone="accent">
        <Icon aria-hidden />
        {c.platforms[item.platforms]}
      </span>
      <span className="kz-chip-meta" data-tone={item.status}>
        {c.status[item.status]}
      </span>
    </>
  );
}

/** One tab per platform the component exists on; a single platform needs no tabs. */
function PlatformTabs({ item, t, web, native }: { item: RegistryItem; t: TranslationDictionary; web: ReactNode; native: ReactNode }) {
  const c = t.docs.component;
  if (item.web && item.native) {
    return (
      <Tabs items={[c.web, c.native]}>
        <Tab value={c.web}>{web}</Tab>
        <Tab value={c.native}>{native}</Tab>
      </Tabs>
    );
  }
  return <>{item.web ? web : native}</>;
}

export async function ComponentDoc({ name, locale, notes }: { name: string; locale: Locale; notes?: ReactNode }) {
  const item = getRegistryItem(name);
  const t = getDictionary(locale);
  const c = t.docs.component;
  const href = (other: string) => `/${locale}/docs/ui/${other}`;
  const titleOf = (other: string) => getRegistryItem(other).title;

  return (
    <>
      <div className="kz-component-meta not-prose" aria-label={c.platformsLabel}>
        <PlatformBadges item={item} t={t} />
        <span className="kz-chip-meta">{c.categories[item.category]}</span>
      </div>
      <p className="kz-docs-note">
        {format(c.platformsLong[item.platforms], { name: item.name })} {c.statusLong[item.status]}
      </p>

      <div className="kz-when not-prose" id="when-to-use">
        <section className="kz-when-card" aria-labelledby="when-to-use-title">
          <h2 id="when-to-use-title">
            <CheckCircle2 size={18} data-icon="do" aria-hidden />
            {c.whenToUse}
          </h2>
          <ul>
            {item.whenToUse.map((text) => (
              <li key={text}>
                <InlineCode text={text} />
              </li>
            ))}
          </ul>
        </section>
        <section className="kz-when-card" aria-labelledby="when-not-to-use-title">
          <h2 id="when-not-to-use-title">
            <XCircle size={18} data-icon="dont" aria-hidden />
            {c.whenNotToUse}
          </h2>
          <ul>
            {item.whenNotToUse.map(({ when, use }) => (
              <li key={when}>
                <InlineCode text={when} />
                {use && (
                  <span className="kz-when-instead">
                    {c.instead} <Link href={href(use)}>{titleOf(use)}</Link>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <h2 id="installation">{c.installation}</h2>
      <PlatformTabs
        item={item}
        t={t}
        web={
          item.web && (
            <>
              <p>{c.install}</p>
              <CodeBlock code={WEB_INSTALL} lang="bash" />
              <p>{c.styles}</p>
              <CodeBlock code={WEB_CSS} lang="css" />
              <p>{c.import}</p>
              <CodeBlock code={item.web.import} lang="tsx" />
            </>
          )
        }
        native={
          item.native && (
            <>
              <p>{c.install}</p>
              <CodeBlock code={NATIVE_INSTALL} lang="bash" />
              <p>{c.import}</p>
              <CodeBlock code={item.native.import} lang="tsx" />
              <p>
                <Rich text={c.nativeSetup} />
              </p>
            </>
          )
        }
      />

      <h2 id="examples">{c.examples}</h2>
      <PlatformTabs
        item={item}
        t={t}
        web={item.web?.examples.map((example) => (
          <section key={example.name} className="kz-example" aria-labelledby={`example-${example.name}`}>
            <h3 id={`example-${example.name}`}>{example.title}</h3>
            <p>
              <InlineCode text={example.description} />
            </p>
            <ExamplePreview title={item.title} example={example} locale={locale} />
          </section>
        ))}
        native={
          item.native && (
            <>
              <p className="kz-docs-note">{c.nativeCode}</p>
              {item.native.differences.length > 0 && (
                <>
                  <p>
                    <strong>{c.differences}</strong>
                  </p>
                  <ul>
                    {item.native.differences.map((text) => (
                      <li key={text}>
                <InlineCode text={text} />
              </li>
                    ))}
                  </ul>
                </>
              )}
              {item.native.examples.map((example, index) => (
                <section key={example.name} className="kz-example" aria-labelledby={`native-example-${example.name}`}>
                  <h3 id={`native-example-${example.name}`}>{example.title}</h3>
                  <p>
              <InlineCode text={example.description} />
            </p>
                  <NativeExamplePreview title={item.title} example={example} locale={locale} eager={!item.web && index === 0} />
                </section>
              ))}
            </>
          )
        }
      />

      <h2 id="props">{c.props}</h2>
      <PlatformTabs
        item={item}
        t={t}
        web={item.web && <PropsTable groups={item.web.props} locale={locale} />}
        native={item.native && <PropsTable groups={item.native.props} locale={locale} />}
      />

      <h2 id="accessibility">{c.accessibility}</h2>
      <ul>
        {item.accessibility.notes.map((text) => (
          <li key={text}>
                <InlineCode text={text} />
              </li>
        ))}
      </ul>
      {item.accessibility.keyboard.length > 0 && (
        <>
          <h3 id="keyboard">{c.keyboard}</h3>
          <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={c.keyboard}>
            <table className="kz-table">
              <thead>
                <tr>
                  <th scope="col">{c.keys}</th>
                  <th scope="col">{c.action}</th>
                </tr>
              </thead>
              <tbody>
                {item.accessibility.keyboard.map(({ keys, action }) => (
                  <tr key={keys}>
                    <th scope="row">
                      <kbd>{keys}</kbd>
                    </th>
                    <td>
                      <InlineCode text={action} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2 id="best-practices">{c.bestPractices}</h2>
      <ul>
        {item.bestPractices.map((text) => (
          <li key={text}>
                <InlineCode text={text} />
              </li>
        ))}
      </ul>

      {notes && (
        <>
          <h2 id="notes">{c.notes}</h2>
          {notes}
        </>
      )}

      {item.related.length > 0 && (
        <>
          <h2 id="related">{c.related}</h2>
          <ul className="kz-related not-prose">
            {item.related.map((other) => {
              const related = getRegistryItem(other);
              return (
                <li key={other}>
                  <Link href={href(other)}>
                    <span className="kz-related-title">{related.title}</span>
                    <span className="kz-related-text">
                      <InlineCode text={related.summary} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p className="kz-component-source not-prose">
        <span>{format(c.source, { version: getRegistryIndex().version })}</span>
        <a href={metaSourceUrl(item)}>{c.edit}</a>
      </p>
    </>
  );
}
