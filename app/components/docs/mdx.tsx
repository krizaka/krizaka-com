import type { AnchorHTMLAttributes, ComponentProps } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import Mermaid from "./LazyMermaid";
import { ComponentCatalog } from "./ComponentCatalog";
import { EventSchema } from "./EventSchema";
import { ComingSoon } from "./ComingSoon";
import { PRODUCT_MANIFESTS, isProductSection, type DocsSection } from "@/lib/docs-source";
import type { Locale } from "@/lib/i18n";
import { resolveDocHref } from "@/lib/doc-links";

export function getMdxComponents(locale: Locale, section: DocsSection): MDXComponents {
  const Anchor = defaultMdxComponents.a;
  const product = isProductSection(section) ? { id: section, manifest: PRODUCT_MANIFESTS[section] } : undefined;
  return {
    ...defaultMdxComponents,
    a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => <Anchor href={resolveDocHref(href, locale, product)} {...props} />,
    Mermaid,
    ComponentCatalog: () => <ComponentCatalog locale={locale} />,
    EventSchema: (props: Omit<ComponentProps<typeof EventSchema>, "locale">) => <EventSchema {...props} locale={locale} />,
    ComingSoon: (props: Omit<ComponentProps<typeof ComingSoon>, "locale">) => <ComingSoon {...props} locale={locale} />,
  };
}
