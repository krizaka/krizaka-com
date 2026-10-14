import type { AnchorHTMLAttributes, ComponentProps, HTMLAttributes } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentCatalog } from "./ComponentCatalog";
import { ComponentHero } from "./ComponentHero";
import { EventSchema } from "./EventSchema";
import { ComingSoon } from "./ComingSoon";
import { DocVideo } from "./DocVideo";
import { paragraphVideo } from "@/lib/doc-video";
import type { DocsSection } from "@/lib/docs-source";
import type { Locale } from "@/lib/i18n";
import { resolveDocHref } from "@/lib/doc-links";
import ArchitectureView, { type ArchitectureViewProps } from "@/app/components/diagrams/ArchitectureView";
import type { Product } from "@/lib/architecture-model";

/** The product whose model a section's architecture blocks read: its own, Krizaka Java for /docs/java, none for /docs/ui. */
const SECTION_PRODUCT: Record<DocsSection, Product | null> = { java: "java", ui: null };

export function getMdxComponents(locale: Locale, section: DocsSection): MDXComponents {
  const Anchor = defaultMdxComponents.a;
  return {
    ...defaultMdxComponents,
    a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => <Anchor href={resolveDocHref(href, locale)} {...props} />,
    // A paragraph that is only a poster linking to a recording is the recording (DocVideo) — decided here, not in `a`,
    // because a <figure> inside a <p> is invalid HTML (and a hydration mismatch). Inside running text it stays a link.
    p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
      const video = paragraphVideo(children);
      return video ? <DocVideo {...video} /> : <p {...props}>{children}</p>;
    },
    // The architecture block of a doc (lib/remark-diagrams.ts) and its MDX form.
    ArchitectureView: (props: ArchitectureViewProps) => <ArchitectureView {...props} fallback={SECTION_PRODUCT[section]} />,
    ComponentCatalog: () => <ComponentCatalog locale={locale} />,
    ComponentHero: () => <ComponentHero locale={locale} />,
    EventSchema: (props: Omit<ComponentProps<typeof EventSchema>, "locale">) => <EventSchema {...props} locale={locale} />,
    ComingSoon: (props: Omit<ComponentProps<typeof ComingSoon>, "locale">) => <ComingSoon {...props} locale={locale} />,
  };
}
