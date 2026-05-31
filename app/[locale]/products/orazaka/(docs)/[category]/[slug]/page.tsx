import { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import Link from "next/link";
import { getDocsList, getDocBySlugAndCategory } from "../../../../../../../lib/docs";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "../../../../../../components/MdxComponents";
import ArchitectureDocHero from "../../../../../../components/ArchitectureDocHero";

/* ─── Category label mapping ─── */
const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  architecture: "Architecture",
  api: "API",
  "core-features": "Core Features",
  operations: "Operations",
  "ui-guidelines": "UI Guidelines",
  guidelines: "Guidelines",
};

export async function generateStaticParams() {
  const locales = ["fr", "en"];
  const docs = await getDocsList();
  return locales.flatMap((locale) =>
    docs.map((doc) => ({
      locale,
      category: doc.category,
      slug: doc.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = await getDocBySlugAndCategory(
    resolvedParams.category,
    resolvedParams.slug
  );
  if (!doc) return { title: "Documentation | Krizaka" };

  return {
    title: `${doc.title} | Orazaka Products | Krizaka`,
    description: doc.description,
    alternates: buildAlternates(
      resolvedParams.locale,
      `/products/orazaka/${resolvedParams.category}/${resolvedParams.slug}`
    ),
  };
}

export default async function OrazakaDocSlugPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const doc = await getDocBySlugAndCategory(
    resolvedParams.category,
    resolvedParams.slug
  );

  if (!doc) {
    notFound();
  }

  const categoryLabel =
    CATEGORY_LABELS[doc.category] ||
    doc.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
          item: "https://krizaka.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Orazaka",
          item: "https://krizaka.com/products/orazaka",
        },
        { "@type": "ListItem", position: 3, name: categoryLabel },
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
          href="/"
          style={{ color: "var(--kz-text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          className="breadcrumb-link"
        >
          Products
        </Link>
        <span style={{ color: "var(--kz-text-muted)", opacity: 0.3, fontSize: 14 }}>/</span>
        <Link
          href="/products/orazaka"
          style={{ color: "var(--kz-text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          className="breadcrumb-link"
        >
          Orazaka
        </Link>
        <span style={{ color: "var(--kz-text-muted)", opacity: 0.3, fontSize: 14 }}>/</span>
        <span style={{ color: "var(--kz-text-muted)" }}>{categoryLabel}</span>
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
              {doc.audience === "developer" ? "For developers" : "For decision-makers"}
            </span>
          )}
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>
            {doc.intro}
          </p>
        </div>
      )}

      {resolvedParams.category === "architecture" && resolvedParams.slug === "architecture" && (
        <ArchitectureDocHero />
      )}

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
