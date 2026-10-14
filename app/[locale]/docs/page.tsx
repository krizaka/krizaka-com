import type { Metadata } from "next";
import Link from "next/link";
import { ProductLogo } from "@krizaka/ui";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { DocsHubPage } from "@krizaka/ui/docs-hub-page";
import type * as PageTree from "fumadocs-core/page-tree";
import { DocsSearchButton } from "@/app/components/docs/DocsSearchButton";
import { DOCS_SECTIONS, getPageTree, type DocsSection } from "@/lib/docs-source";
import { mavenVersion, npmVersion } from "@/lib/registry-versions";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { asLocale, getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = (lang: "en" | "fr") => getDictionary(lang).docs.meta;
  return localizedMetadata(locale, { path: "/docs", en: copy("en"), fr: copy("fr") });
}

/* The pages most asked for: installing and theming Krizaka UI. (Krizaka Java's documentation is java.krizaka.com.) */
const POPULAR = [
  { id: "uiInstall", href: "/docs/ui/installation", section: "ui" },
  { id: "uiTokens", href: "/docs/ui/tokens", section: "ui" },
] as const;

/* What is new, from the registries (lib/registry-versions.json, read at build): never a version typed here. */
const NEW = [
  { id: "ui", href: "/docs/ui", version: () => npmVersion("@krizaka/ui"), name: "@krizaka/ui" },
  { id: "charts", href: "/docs/ui", version: () => npmVersion("@krizaka/charts"), name: "@krizaka/charts" },
] as const;

/** The first pages of a collection, in the sidebar's order: its quick links. */
function firstPages(section: DocsSection, locale: string, count = 3): { href: string; label: string }[] {
  const out: { href: string; label: string }[] = [];
  const walk = (nodes: PageTree.Node[]) => {
    for (const node of nodes) {
      if (out.length >= count) return;
      if (node.type === "page" && node.url !== `/${locale}/docs/${section}`) out.push({ href: node.url, label: String(node.name) });
      else if (node.type === "folder") walk(node.children);
    }
  };
  walk(getPageTree(section, locale as never).children);
  return out;
}

/* The documentation hub — the DocsHub template of @krizaka/ui (lib/page-templates.ts): the search in the middle of the
   hero (it opens the site's palette, ⌘K), the collections with their first pages, a quick
   start per collection beside the most read pages, what is new in the registries, and the owl's promise. */
export default async function DocsHub({ params }: Props) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale).docs;
  const h = t.hub;
  const copy = { copyLabel: t.chrome.copy, copiedLabel: t.chrome.copied };
  return (
    <>
      <TopNavBar />
      <main>
        <DocsHubPage
          linkAs={Link}
          eyebrow={h.kicker}
          title={h.title}
          lead={h.lead}
          search={<DocsSearchButton label={h.search} />}
          searchHints={
            <>
              {h.try}{" "}
              {POPULAR.slice(0, 3).map((p, i) => (
                <span key={p.id}>
                  {i > 0 && " · "}
                  <Link href={`/${locale}${p.href}`}>{h.shortcuts.items[p.id].title}</Link>
                </span>
              ))}
            </>
          }
          collectionsTitle={h.collections}
          collections={DOCS_SECTIONS.map((section) => ({
            id: section,
            mark: <ProductLogo id="krizaka" size={26} animated={false} />,
            title: t.sections[section].title,
            href: `/${locale}/docs/${section}`,
            description: t.sections[section].description,
            links: firstPages(section, locale),
          }))}
          quickstarts={{
            title: h.quickstarts,
            children: (
              <CodeTabs
                label={h.quickstarts}
                tabs={[
                  { id: "ui", label: "Krizaka UI", content: <CodeBlock code="npm install @krizaka/ui @krizaka/tailwind @krizaka/tokens" language="bash" file="Terminal" {...copy} /> },
                  {
                    id: "java",
                    label: "Krizaka Java",
                    content: <CodeBlock code={`<parent>\n  <groupId>com.krizaka</groupId>\n  <artifactId>krizaka-parent</artifactId>\n  <version>${mavenVersion("krizaka-parent") ?? "LATEST"}</version>\n</parent>`} language="xml" file="pom.xml" {...copy} />,
                  },
                ]}
              />
            ),
          }}
          popular={{
            title: h.popular,
            items: POPULAR.map((p) => ({ href: `/${locale}${p.href}`, title: h.shortcuts.items[p.id].title, meta: t.sections[p.section].title })),
          }}
          whatsNew={{
            title: h.whatsNew,
            items: NEW.flatMap((n) => {
              const version = n.version();
              return version ? [{ href: `/${locale}${n.href}`, title: h.new[n.id], meta: `${n.name} ${version}` }] : [];
            }),
          }}
          promise={{ label: h.promiseLabel, text: h.promise }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
