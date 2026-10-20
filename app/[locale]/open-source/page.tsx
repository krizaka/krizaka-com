import type { Metadata } from "next";
import Link from "next/link";
import { ChatIcon, ExternalIcon, FlagIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { ChipLink } from "@krizaka/ui/chip-link";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { localizedMetadata } from "@/lib/seo";
import { NAV_PRODUCTS } from "@/lib/nav";
import { githubRepositories, publicRepositoryCount } from "@/lib/org-stats";
import { kindOfRepository, productOfRepository } from "@/lib/repository-catalogue";
import snapshot from "@/lib/registry-versions.json";
import manifests from "@/lib/product-manifests.json";
import { mavenArtifactCount, npmPackages } from "@/lib/registry-versions";
import { packageRows, weeklyTotal, type RegistrySnapshot } from "@/lib/package-catalogue";
import { howItFits } from "@/lib/how-it-fits";
import { ENGINE_USES } from "@/lib/engine-uses";
import { PRODUCTS } from "@/lib/products";
import { ENGINE } from "@/lib/story";
import { KITS } from "@/lib/product-stack";
import { MANIFESTS_READ_AT, productStackRows } from "@/lib/product-stack-data";
import { PUBLIC_CHANNELS, PUBLIC_REPOSITORIES } from "@/lib/public-channels";
import { format, getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import { STACK } from "@/lib/stack";
import { BUILDING_BLOCKS } from "@/lib/building-blocks";
import TopNavBar from "@/app/components/TopNavBar";
import ProductStackTable from "@/app/components/ProductStackTable";
import FigureTiles from "@/app/components/FigureTiles";
import ButtonLink from "@/app/components/ButtonLink";
import { StackCards } from "@/app/components/home/OpenStack";
import { PackagesTable, RepositoriesTable, type RepositoryRow } from "./OpenSourceTables";
import HowItFits from "./HowItFits";
import { JavaVisual, UiVisual } from "./StackVisual";
import "./open-source.css";

/* /open-source — the site's second view (the home is the first; 2026-10-17): the technical view, as refined as the home
   (docs-hub template). One primary action per section, no boxes in boxes; everything read from data at build.
   1. The hero: one line, the live figures (repositories, npm packages, Maven artifacts, the licence), GitHub.
   2. The stack: Krizaka UI → ui.krizaka.com, Krizaka Java → java.krizaka.com, each with a still mini-visual and its
      latest version (npm, Maven Central); the building blocks' pages, as quiet links.
   3. Packages: a searchable DataTable of every published package (lib/package-catalogue.ts) — registry and family
      facets, the latest version, the weekly downloads (npm), the links.
   4. Repositories: every repository grouped by product, with its platform, language and last push (GitHub at build).
   5. How it fits: products → engine → building blocks → shared services (lib/how-it-fits.ts), an ordered list that is
      its own text version; what each product runs on, folded.
   6. Contribute: the contact page's picker (a discussion or an issue, on the right repository), the guide, the code of
      conduct, the licence. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/open-source",
    en: {
      title: "Open source — every Krizaka package and repository, and how they fit",
      description: "Everything Krizaka builds is public under Apache-2.0: Krizaka UI (ui.krizaka.com), Krizaka Java (java.krizaka.com), every npm and Maven Central package and every repository.",
    },
    fr: {
      title: "Open source — chaque paquet et dépôt Krizaka, et comment tout s'emboîte",
      description: "Tout ce que Krizaka construit est public sous Apache-2.0 : Krizaka UI (ui.krizaka.com), Krizaka Java (java.krizaka.com), chaque paquet npm et Maven Central et chaque dépôt.",
    },
  });
}

const PRODUCT_IDS = NAV_PRODUCTS.map((p) => p.id);
const CONDUCT_URL = "https://github.com/krizaka/.github/blob/main/CODE_OF_CONDUCT.md";
const CONTRIBUTING_URL = "https://github.com/krizaka/.github/blob/main/CONTRIBUTING.md";
const LICENSE_URL = "https://www.apache.org/licenses/LICENSE-2.0";

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const site = dict.site;
  const t = site.openSource;
  const names: Record<string, string> = { ...Object.fromEntries(NAV_PRODUCTS.map((p) => [p.id, p.name])), krizaka: t.platform.name };

  const repositories = githubRepositories().filter((r) => !r.archived);
  const repoRows: RepositoryRow[] = repositories.map((r) => {
    const product = productOfRepository(r.name, PRODUCT_IDS);
    return {
      id: r.name,
      name: r.name,
      url: r.url,
      // Orochia's GitHub descriptions are written for its own audience: krizaka.com says one neutral line each.
      line: r.name.startsWith("orochia") ? (t.orochiaRepos[r.name as keyof typeof t.orochiaRepos] ?? t.orochiaRepos.default) : r.description,
      product: names[product],
      kind: t.kinds[kindOfRepository(r, product)],
      language: r.language ?? "—",
      pushedAt: r.pushedAt ?? "",
    };
  });
  const javaSite = STACK.find((s) => s.id === "java")!.url;
  const packages = packageRows(snapshot as RegistrySnapshot, repositories.map((r) => r.name), javaSite);
  const layers = howItFits(PRODUCTS, ENGINE, ENGINE_USES, manifests.products, (snapshot as RegistrySnapshot).mavenMeta, (snapshot as RegistrySnapshot).maven ?? {});

  const figures = [
    { id: "repositories", value: publicRepositoryCount(), label: t.figures.repositories },
    { id: "npm", value: npmPackages().length, label: t.figures.npm },
    { id: "maven", value: mavenArtifactCount(), label: t.figures.maven },
    // Read from api.npmjs.org at build; absent (0) when the registry was unreachable. Maven Central publishes no download count.
    { id: "downloads", value: weeklyTotal(packages) ?? 0, label: t.figures.downloads },
  ].filter((f) => f.value > 0);

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} align="center" linkAs={Link}>
        <div className="os-hero-figures">
          <FigureTiles figures={[...figures, { id: "license", value: "Apache-2.0", label: t.figures.license }]} label={t.figuresLabel} locale={locale} />
        </div>
        <div className="os-hero-actions">
          <ButtonLink href={GITHUB_ORG_URL} variant="primary" size="lg" shimmer magnetic>
            {t.github} <ExternalIcon size={14} aria-hidden />
          </ButtonLink>
        </div>
      </PageHero>

      <Section id="stack" eyebrow={t.stackEyebrow} title={t.stackTitle} lead={t.stackLead}>
        <StackCards
          locale={locale}
          mavenArtifacts={mavenArtifactCount()}
          visuals={{ ui: <UiVisual label={t.stackVisual.identities} />, java: <JavaVisual label={t.stackVisual.dependency} /> }}
        />
        <nav aria-label={t.blocksLabel} className="os-blocks">
          <span>{t.blocksLabel}</span>
          {BUILDING_BLOCKS.map((b) => (
            <ChipLink key={b.id} asChild size="sm">
              <Link href={`/open-source/${b.id}`} prefetch={false}>
                {site.blocks.items[b.id].name}
              </Link>
            </ChipLink>
          ))}
        </nav>
      </Section>

      <Section id="packages" eyebrow={t.packages.eyebrow} title={t.packages.title} lead={t.packages.lead} reveal divider>
        <PackagesTable rows={packages} />
      </Section>

      <Section id="repositories" eyebrow={t.repositories.eyebrow} title={t.repositories.title} lead={t.repositories.lead} reveal divider>
        <RepositoriesTable rows={repoRows} />
      </Section>

      <Section id="how-it-fits" eyebrow={t.fits.eyebrow} title={t.fits.title} lead={t.fits.lead} reveal divider>
        <HowItFits layers={layers} names={names} w={t.fits} />
        <details id="runs-on" className="os-runs">
          <summary>{t.fits.runs}</summary>
          <ProductStackTable
            rows={productStackRows(PRODUCT_IDS).map((r) => ({ ...r, name: names[r.id] }))}
            kits={KITS}
            labels={{
              caption: t.runs.caption,
              product: t.runs.product,
              yes: t.runs.yes,
              no: t.runs.no,
              partial: t.runs.partial,
              isEngine: t.runs.isEngine,
              planned: t.runs.planned,
              transport: t.runs.transport,
              parts: t.runs.parts,
              kits: Object.fromEntries(KITS.map((k) => [k, site.story.kits[k].name])) as Record<(typeof KITS)[number], string>,
            }}
          />
          <p className="os-stack-read">{format(t.runs.read, { date: MANIFESTS_READ_AT })}</p>
        </details>
      </Section>

      <Section id="contribute" divider aria-labelledby="os-contribute">
        <CtaPanel id="os-contribute" title={t.contribute.title} body={t.contribute.body} reveal>
          <ButtonLink href={CONTRIBUTING_URL} variant="primary" size="lg">
            {t.contribute.guide} <ExternalIcon size={13} aria-hidden />
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
                  {PUBLIC_REPOSITORIES.map(({ product, repo }) => (
                    <li key={product}>
                      <a href={`https://github.com/krizaka/${repo}/${ch.path}`} target="_blank" rel="noopener noreferrer">
                        <ProductLogo id={product} size={16} animated={false} /> {site.contactPage.publicProducts[product]}
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
