import type { ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, MonitorSmartphone, Smartphone, Monitor, XCircle } from "lucide-react";
// Named exports: a Server Component cannot dot into a client module (`Tabs.Root`).
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@krizaka/ui/tabs";
import type { TOCItemType } from "fumadocs-core/toc";
import Rich from "@/app/components/Rich";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { KRIZAKA_UI_REPO_URL } from "@/lib/site";
import {
  componentHref,
  getRegistryIndex,
  getRegistryItem,
  KIT_PACKAGES,
  KIT_SOURCES,
  type Kit,
  type Platform,
  type RegistryItem,
  resolveReference,
} from "@/lib/ui-registry";
import { inventoryOf } from "@/lib/ui-inventory";
import { CodeBlock, ExamplePreview, NativeExamplePreview } from "./ExamplePreview";
import { InlineCode } from "./InlineCode";
import { PropsTable } from "./PropsTable";

/* A /docs/ui/<name> page, generated from the @krizaka/ui registry — the component's code drives every word of it:
   its meta.ts (summary, when to use and not, best practices, accessibility, platforms, status, related), its named
   examples (rendered live, code to copy, web and React Native) and the props of its types. The page chrome is in
   messages; the documentation itself is English, as written in the code. Server Component.
   The same page renders a component of a product kit (/docs/<product>/ui/<name>, `kit`): it adds why the component
   exists above Krizaka UI, the @krizaka/ui primitives it is built on, its deprecation, and its examples wear the
   kit's theme. */

const PLATFORM_ICON = { web: Monitor, native: Smartphone, both: MonitorSmartphone } satisfies Record<Platform, unknown>;

const WEB_INSTALL = "npm install @krizaka/ui @krizaka/tailwind @krizaka/tokens tailwindcss";
const WEB_CSS = `@import "tailwindcss";
@import "@krizaka/tailwind";
@import "@krizaka/ui/tailwind.css";`;
const NATIVE_INSTALL = "npx expo install react-native-svg\nnpm install @krizaka/ui";

/** Where the documentation of a component is written: its meta.ts in krizaka-ui, or in the product kit. */
export function metaSourceUrl(item: RegistryItem, kit: Kit = "ui"): string {
  if (kit !== "ui") return `${KIT_SOURCES[kit]}/${item.name}.meta.ts`;
  // Another package of Krizaka UI (@krizaka/charts) says where its meta is, from the repository root.
  if (item.source) return `${KRIZAKA_UI_REPO_URL}/blob/main/${item.source}`;
  const file = item.type === "native" ? `src/native/meta/${item.name}.ts` : item.name === "cn" ? "src/cn.meta.ts" : `src/${item.name}/meta.ts`;
  return `${KRIZAKA_UI_REPO_URL}/blob/main/packages/ui/${file}`;
}

/** The table of contents of a component page, in the reader's language. */
export function componentToc(name: string, t: TranslationDictionary, hasNotes: boolean, kit: Kit = "ui"): TOCItemType[] {
  const item = getRegistryItem(name, kit);
  const c = t.docs.component;
  const entries: [string, string | false][] = [
    ["why", Boolean(item.why) && t.docs.kit.why],
    ["when-to-use", c.whenToUse],
    ["installation", c.installation],
    ["examples", item.web?.examples.length !== 0 && c.examples],
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

/** One tab per platform the component exists on (@krizaka/ui tabs); a single platform needs no tabs. */
function PlatformTabs({ item, t, web, native }: { item: RegistryItem; t: TranslationDictionary; web: ReactNode; native: ReactNode }) {
  const c = t.docs.component;
  if (item.web && item.native) {
    return (
      <TabsRoot defaultValue="web" className="my-4 gap-3">
        <TabsList aria-label={c.platformsLabel}>
          <TabsTrigger value="web">{c.web}</TabsTrigger>
          <TabsTrigger value="native">{c.native}</TabsTrigger>
        </TabsList>
        <TabsContent value="web">{web}</TabsContent>
        <TabsContent value="native">{native}</TabsContent>
      </TabsRoot>
    );
  }
  return <>{item.web ? web : native}</>;
}

export async function ComponentDoc({ name, locale, notes, kit = "ui" }: { name: string; locale: Locale; notes?: ReactNode; kit?: Kit }) {
  const item = getRegistryItem(name, kit);
  const t = getDictionary(locale);
  const c = t.docs.component;
  const k = t.docs.kit;
  const index = getRegistryIndex(kit);
  const ref = (other: string) => (kit === "ui" ? { kit, name: other } : resolveReference(other, kit));
  const href = (other: string) => componentHref(locale, ref(other).kit, ref(other).name);
  const titleOf = (other: string) => getRegistryItem(ref(other).name, ref(other).kit).title;
  const inventory = kit === "ui" ? inventoryOf(item.name, item.status, item.deprecated) : null;
  const kitWords = kit === "ui" ? undefined : { product: t.docs.sections[kit].title, package: KIT_PACKAGES[kit] };

  return (
    <>
      <div className="kz-component-meta not-prose" aria-label={c.platformsLabel}>
        <PlatformBadges item={item} t={t} />
        <span className="kz-chip-meta">{c.categories[item.category]}</span>
      </div>
      <p className="kz-docs-note">
        {kitWords ? format(k.platformLong, kitWords) : format(c.platformsLong[item.platforms], { entry: (item.platforms === "native" ? item.native?.entry : item.web?.entry) ?? `@krizaka/ui/${item.name}` })} {c.statusLong[item.status]}
      </p>

      {kit === "ui" && inventory?.why && (
        <p className="kz-docs-note">
          <strong>{t.docs.ia.catalog.why}.</strong> {inventory.why}
        </p>
      )}

      {item.deprecated && (
        <div className="kz-deprecated not-prose" role="note">
          <strong>{c.status.deprecated}</strong>
          <span>
            {format(k.deprecatedSince, { since: item.deprecated.since, removedIn: item.deprecated.removedIn })}
            {item.deprecated.reason && <> {item.deprecated.reason}</>}
            {item.deprecated.use && (
              <>
                {" "}
                {k.useInstead} <Link href={href(item.deprecated.use)}>{titleOf(item.deprecated.use)}</Link>
                {ref(item.deprecated.use).kit === "ui" && <> ({k.fromKrizakaUi})</>}.
              </>
            )}
          </span>
        </div>
      )}

      {item.why && (
        <>
          <h2 id="why">{k.why}</h2>
          <p>
            <InlineCode text={item.why} />
          </p>
          {item.builtOn && item.builtOn.length > 0 && (
            <p className="kz-built-on not-prose">
              <span>{k.builtOn}</span>
              {item.builtOn.map((other) => (
                <Link key={other} href={href(other)} className="kz-chip-meta" data-tone="accent">
                  {titleOf(other)}
                </Link>
              ))}
            </p>
          )}
        </>
      )}

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
              <CodeBlock code={item.install?.web ?? index.install?.command ?? WEB_INSTALL} lang="bash" />
              {/* A package that carries its own styles (@krizaka/charts: an embedded stylesheet) needs no CSS line. */}
              {!item.install?.web && (
                <>
                  <p>{c.styles}</p>
                  <CodeBlock code={index.install?.css ?? WEB_CSS} lang="css" />
                </>
              )}
              {index.install?.note && (
                <p className="kz-docs-note">
                  <InlineCode text={index.install.note} />
                </p>
              )}
              <p>{c.import}</p>
              <CodeBlock code={item.web.import} lang="tsx" />
            </>
          )
        }
        native={
          item.native && (
            <>
              <p>{c.install}</p>
              <CodeBlock code={item.install?.native ?? NATIVE_INSTALL} lang="bash" />
              <p>{c.import}</p>
              <CodeBlock code={item.native.import} lang="tsx" />
              <p>
                <Rich text={c.nativeSetup} />
              </p>
            </>
          )
        }
      />

      {item.web?.examples.length !== 0 && <h2 id="examples">{c.examples}</h2>}
      <PlatformTabs
        item={item}
        t={t}
        web={item.web?.examples.map((example) => (
          <section key={example.name} className="kz-example" aria-labelledby={`example-${example.name}`}>
            <h3 id={`example-${example.name}`}>{example.title}</h3>
            <p>
              <InlineCode text={example.description} />
            </p>
            <ExamplePreview title={item.title} example={example} locale={locale} kit={kit} />
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
              const related = getRegistryItem(ref(other).name, ref(other).kit);
              return (
                <li key={other}>
                  <Link href={href(other)}>
                    <span className="kz-related-title">
                      {related.title}
                      {kit !== "ui" && ref(other).kit === "ui" && <span className="kz-related-kit"> · {k.fromKrizakaUi}</span>}
                    </span>
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
        <span>{kitWords ? format(k.source, { package: kitWords.package, version: index.version }) : format(c.source, { version: index.version })}</span>
        <a href={metaSourceUrl(item, kit)}>{c.edit}</a>
      </p>
    </>
  );
}
