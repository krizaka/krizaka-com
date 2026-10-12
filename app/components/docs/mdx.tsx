import type { AnchorHTMLAttributes, ComponentProps } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentCatalog } from "./ComponentCatalog";
import { ProductKits } from "./ProductKits";
import { EventSchema } from "./EventSchema";
import { ComingSoon } from "./ComingSoon";
import { PRODUCT_MANIFESTS, isProductSection, type DocsSection } from "@/lib/docs-source";
import type { Locale } from "@/lib/i18n";
import { resolveDocHref } from "@/lib/doc-links";
import ArchitectureView, { type ArchitectureViewProps } from "@/app/components/diagrams/ArchitectureView";
import SequenceDiagram from "@/app/components/diagrams/SequenceDiagram";
import StateDiagram from "@/app/components/diagrams/StateDiagram";
import InterceptorPipeline from "@/app/components/diagrams/InterceptorPipeline";
import { pipelineSteps, type Product } from "@/lib/architecture-model";
import { getDictionary } from "@/lib/i18n";

/** The product whose model a section's schema blocks read: its own, Krizaka Java for /docs/java, none for /docs/ui. */
const SECTION_PRODUCT: Record<DocsSection, Product | null> = { orazaka: "orazaka", orochia: "orochia", java: "java", ui: null, yororis: null };

export function getMdxComponents(locale: Locale, section: DocsSection): MDXComponents {
  const Anchor = defaultMdxComponents.a;
  const product = isProductSection(section) ? { id: section, manifest: PRODUCT_MANIFESTS[section] } : undefined;
  return {
    ...defaultMdxComponents,
    a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => <Anchor href={resolveDocHref(href, locale, product)} {...props} />,
    // The schema blocks of a doc (lib/remark-diagrams.ts) and their MDX form.
    ArchitectureView: (props: ArchitectureViewProps) => <ArchitectureView {...props} locale={locale} fallback={SECTION_PRODUCT[section]} />,
    PipelineView: () => (
      <div className="not-prose" style={{ margin: "24px 0 32px" }}>
        <InterceptorPipeline steps={pipelineSteps()} text={getDictionary(locale).diagrams.pipeline} />
      </div>
    ),
    SequenceDiagram: ({ source }: { source: string }) => <SequenceDiagram source={source} product={SECTION_PRODUCT[section]} locale={locale} />,
    StateDiagram: ({ source }: { source: string }) => <StateDiagram source={source} product={SECTION_PRODUCT[section]} locale={locale} />,
    ComponentCatalog: () => <ComponentCatalog locale={locale} />,
    ProductKits: () => <ProductKits locale={locale} />,
    EventSchema: (props: Omit<ComponentProps<typeof EventSchema>, "locale">) => <EventSchema {...props} locale={locale} />,
    ComingSoon: (props: Omit<ComponentProps<typeof ComingSoon>, "locale">) => <ComingSoon {...props} locale={locale} />,
  };
}
