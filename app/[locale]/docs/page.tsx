import type { Metadata } from "next";
import { floorFigure } from "@/lib/figure-floor";
import Link from "next/link";
import { ChatIcon, ExternalIcon, FlagIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { CodeBlock } from "@krizaka/ui/code-block";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { DocsHubPage } from "@krizaka/ui/docs-hub-page";
import { Section } from "@krizaka/ui/page";
import { localizedMetadata } from "@/lib/seo";
import { githubRepositories } from "@/lib/org-stats";
import { openSourceRepositories } from "@/lib/repository-catalogue";
import snapshot from "@/lib/registry-versions.json";
import manifests from "@/lib/product-manifests.json";
import { npmPackages, publishedVersion } from "@/lib/registry-versions";
import { packageRows, type RegistrySnapshot } from "@/lib/package-catalogue";
import { GOOD_FIRST_URL } from "@/lib/library-links";
import { CONDUCT_URL, CONTRIBUTING_URL, START_PATHS } from "@/lib/docs-start";
import { howItFits } from "@/lib/how-it-fits";
import { PRODUCTS } from "@/lib/products";
import { PUBLIC_CHANNELS } from "@/lib/public-channels";
import { publicChannels } from "@/lib/github-channels";
import { format, getDictionary } from "@/lib/i18n";
import { STACK } from "@/lib/stack";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import { InstallTabs } from "./StackGlance";
import { PackagesTable } from "./OpenSourceTables";
import HowItFits from "./HowItFits";
import "./open-source.css";

/* /docs — the documentation hub people can follow, on its declared template (docs-hub: @krizaka/ui DocsHubPage).
   Founder, 2026-10-30: the old /open-source was « une page de stats »; this page answers « where do I start? ».
   1. The hub: the reader picks who they are (build an interface, build a Java service, use a product, contribute); each
      path opens the documentation on its own site with its first three pages (lib/docs-start.ts), then the quick start
      of Krizaka UI with the live version.
   2. A quiet line of figures (read at build) — never the headline.
   3. How it fits: products → engine → building blocks → shared services, as an ordered list.
   4. Reference, folded: every package and repository (npm, Maven Central, GitHub).
   5. Contribute: the guide, good first issues, the contact page's picker, the code of conduct, the licence.
   /open-source (and /<locale>/open-source) answers 308 here (lib/docs-redirects.ts). Only what is open source is listed. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/docs",
    en: {
      title: "Docs — where to start with Krizaka UI, Krizaka Java and our products",
      description:
        "Pick what you want to do: build an interface with Krizaka UI, a Java service with Krizaka Java, use our products or contribute. Each path opens the documentation on its own site. Open source, Apache-2.0.",
    },
    fr: {
      title: "Documentation — par où commencer avec Krizaka UI, Krizaka Java et nos produits",
      description:
        "Choisissez ce que vous voulez faire : construire une interface avec Krizaka UI, un service Java avec Krizaka Java, utiliser nos produits ou contribuer. Chaque chemin ouvre la documentation sur son propre site. Open source, Apache-2.0.",
    },
  });
}

const PRODUCT_IDS = PRODUCTS.map((p) => p.id);
const LICENSE_URL = "https://www.apache.org/licenses/LICENSE-2.0";

export default async function DocsPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const site = dict.site;
  const t = site.openSource;
  const h = t.hub;
  const channelGroups = publicChannels();
  const allRepositories = githubRepositories();
  const repositories = openSourceRepositories(allRepositories, PRODUCT_IDS);
  const javaSite = STACK.find((s) => s.id === "java")!.url;
  const packages = packageRows(
    snapshot as RegistrySnapshot,
    allRepositories.filter((r) => !r.archived).map((r) => r.name),
    javaSite,
    PRODUCT_IDS,
  );
  const layers = howItFits(
    manifests.products,
    (snapshot as RegistrySnapshot).mavenMeta,
    (snapshot as RegistrySnapshot).maven ?? {},
  );
  const fmt = new Intl.NumberFormat(locale);
  const uiVersion = publishedVersion("@krizaka/ui");

  return (
    <main className="os-page">
      <SiteBar />

      <DocsHubPage
        eyebrow={h.eyebrow}
        title={h.title}
        lead={h.lead}
        linkAs={Link}
        linksLayout="stack"
        collectionsTitle={h.startLabel}
        collections={START_PATHS.map((path) => {
          const words = h.paths[path.id];
          const labels: Record<string, string> = words.links;
          return {
            id: path.id,
            mark: <ProductLogo id={path.id === "products" ? "orazaka" : "krizaka"} size={20} animated={false} />,
            title: words.title,
            href: path.href,
            description: words.text,
            links: path.links.map((l) => ({
              href: l.href,
              label: l.name ? format(labels.site, { name: l.name }) : labels[l.id],
            })),
          };
        })}
        quickstarts={
          uiVersion
            ? {
                title: h.quickstart.title,
                children: (
                  <div className="os-quickstart">
                    <ol className="os-steps">
                      <li>
                        <p className="os-step-title">{h.quickstart.install}</p>
                        <CodeBlock
                          code={`npm install @krizaka/ui@${uiVersion} @krizaka/tailwind`}
                          language="bash"
                          file="terminal"
                          copyLabel={t.install.copy}
                          copiedLabel={t.install.copied}
                        />
                      </li>
                      <li>
                        <p className="os-step-title">{h.quickstart.styles}</p>
                        <CodeBlock
                          code={`@import "tailwindcss";\n@import "@krizaka/tailwind";\n@import "@krizaka/ui/tailwind.css";`}
                          language="css"
                          file="app/globals.css"
                          copyLabel={t.install.copy}
                          copiedLabel={t.install.copied}
                        />
                      </li>
                      <li>
                        <p className="os-step-title">{h.quickstart.use}</p>
                        <CodeBlock
                          code={`import { Button } from "@krizaka/ui/button";\n\n<Button variant="primary">${h.quickstart.sample}</Button>`}
                          language="tsx"
                          file="app/page.tsx"
                          copyLabel={t.install.copy}
                          copiedLabel={t.install.copied}
                        />
                      </li>
                    </ol>
                    <p className="os-step-title">{h.quickstart.other}</p>
                    <InstallTabs locale={locale} skip={["ui"]} />
                  </div>
                ),
              }
            : undefined
        }
      />

      <p className="os-stats">
        {format(h.stats, {
          repositories: fmt.format(floorFigure(repositories.length)),
          npm: fmt.format(floorFigure(npmPackages().length)),
        })}
      </p>

      <Section id="how-it-fits" eyebrow={t.fits.eyebrow} title={t.fits.title} lead={h.fitsNote} reveal divider>
        <HowItFits layers={layers} w={t.fits} />
      </Section>

      <Section id="reference" eyebrow={t.packages.eyebrow} divider>
        <details className="os-reference">
          <summary>{h.reference.title}</summary>
          <p className="os-note">{h.reference.lead}</p>
          <PackagesTable rows={packages} />
        </details>
      </Section>

      <Section id="contribute" divider aria-labelledby="os-contribute">
        <CtaPanel id="os-contribute" title={t.contribute.title} body={t.contribute.body} reveal>
          <ButtonLink href={CONTRIBUTING_URL} variant="primary" size="lg">
            {t.contribute.guide} <ExternalIcon size={13} aria-hidden />
          </ButtonLink>
          <ButtonLink href={GOOD_FIRST_URL} variant="secondary" size="lg">
            {t.contribute.goodFirst} <ExternalIcon size={13} aria-hidden />
          </ButtonLink>
        </CtaPanel>
        <div className="os-picker">
          {PUBLIC_CHANNELS.map((ch) => {
            const words = dict.contact.channels.find((c) => c.kind === ch.id)!;
            const Icon = ch.id === "discussions" ? ChatIcon : FlagIcon;
            return (
              <div key={ch.id} className="os-picker-row">
                <p className="os-picker-title">
                  <Icon size={16} aria-hidden /> {words.cta}
                </p>
                <ul className="os-picker-repos">
                  {channelGroups
                    .filter((g) => g.group === "stack")
                    .flatMap((g) => g.entries)
                    .map((e) => (
                      <li key={e.id}>
                        <a href={e[ch.id].href} target="_blank" rel="noopener noreferrer">
                          <ProductLogo id={e.mark as never} size={16} animated={false} /> {e.name}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            );
          })}
          <p className="os-picker-legal">
            <a href={CONDUCT_URL}>{t.contribute.conduct}</a> · <a href={LICENSE_URL}>{t.contribute.license}</a>
          </p>
        </div>
      </Section>
    </main>
  );
}
