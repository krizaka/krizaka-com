import type { ReactNode } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./MdxComponents";
import type { DocContent } from "@/lib/docs";
import { getDictionary } from "@/lib/i18n";

/* A documentation article, identical for every product: breadcrumb, curated intro with its
   audience, an optional interactive hero, then the synced markdown (MDX). */

export const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  architecture: "Architecture",
  api: "API",
  "core-features": "Core Features",
  operations: "Operations",
  "ui-guidelines": "UI Guidelines",
  guidelines: "Guidelines",
};

export const categoryLabel = (category: string) =>
  CATEGORY_LABELS[category] || category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function DocArticle({ doc, product, hero, locale }: { doc: DocContent; product: { name: string; href: string }; hero?: ReactNode; locale: string }) {
  const text = getDictionary(locale).site.docs;
  const categoryLabelText = categoryLabel(doc.category);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    author: { "@type": "Organization", name: "Krizaka" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Products",
          item: "https://www.krizaka.com/products",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: product.name,
          item: `https://www.krizaka.com${product.href}`,
        },
        { "@type": "ListItem", position: 3, name: categoryLabelText },
        { "@type": "ListItem", position: 4, name: doc.title },
      ],
    },
  };

  return (
    <article
      className="docs-article animated-fade-in"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 32,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          opacity: 0.8,
        }}
      >
        <Link
          href="/products"
          style={{ color: "var(--kz-text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          className="breadcrumb-link"
        >
          {text.products}
        </Link>
        <span style={{ color: "var(--kz-text-muted)", opacity: 0.3, fontSize: 14 }}>/</span>
        <Link
          href={product.href}
          style={{ color: "var(--kz-text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          className="breadcrumb-link"
        >
          {product.name}
        </Link>
        <span style={{ color: "var(--kz-text-muted)", opacity: 0.3, fontSize: 14 }}>/</span>
        <span style={{ color: "var(--kz-text-muted)" }}>{categoryLabelText}</span>
        <span style={{ color: "var(--kz-text-muted)", opacity: 0.3, fontSize: 14 }}>/</span>
        <span style={{ color: "var(--kz-accent)", fontWeight: 600 }}>
          {doc.title}
        </span>
      </nav>

      {/* Curated human intro + audience (from the publication manifest) */}
      {doc.intro && (
        <div
          style={{
            margin: "0 0 36px",
            padding: "18px 20px",
            borderRadius: "var(--kz-radius-lg)",
            border: "1px solid var(--kz-border-subtle)",
            background: "var(--kz-surface-1)",
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          {doc.audience && (
            <span
              style={{
                flexShrink: 0,
                marginTop: 1,
                padding: "3px 9px",
                borderRadius: 9999,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--kz-accent)",
                background: "var(--kz-accent-soft)",
                border: "1px solid color-mix(in srgb, var(--kz-accent) 25%, transparent)",
              }}
            >
              {doc.audience === "developer" ? text.forDevelopers : text.forDecisionMakers}
            </span>
          )}
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>
            {doc.intro}
          </p>
        </div>
      )}

      {hero}

      <div className="mdx-content-container">
        <MDXRemote
          source={doc.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </div>

      <style>{`
        .breadcrumb-link:hover {
          color: var(--kz-text-primary) !important;
        }
        .animated-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  );
}
