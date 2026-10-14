import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentCatalog } from "./ComponentCatalog";
import { ComponentHero } from "./ComponentHero";
import { DocVideo } from "./DocVideo";
import { paragraphVideo } from "@/lib/doc-video";
import type { Locale } from "@/lib/i18n";
import { resolveDocHref } from "@/lib/doc-links";
export function getMdxComponents(locale: Locale): MDXComponents {
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
    ComponentCatalog: () => <ComponentCatalog locale={locale} />,
    ComponentHero: () => <ComponentHero locale={locale} />,
  };
}
