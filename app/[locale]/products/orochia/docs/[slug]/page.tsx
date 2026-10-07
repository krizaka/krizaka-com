import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { getDocsList, getDocBySlugAndCategory } from "@/lib/docs";
import { buildAlternates } from "@/lib/seo";
import { mdxComponents } from "@/app/components/MdxComponents";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function load(slug: string) {
  const docs = await getDocsList("orochia");
  const meta = docs.find((d) => d.slug === slug);
  return meta ? getDocBySlugAndCategory(meta.category, slug, "orochia") : null;
}

export async function generateStaticParams() {
  const docs = await getDocsList("orochia");
  return ["fr", "en"].flatMap((locale) => docs.map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = await load(slug);
  if (!doc) return { title: "Orochia documentation | Krizaka" };
  return {
    title: `${doc.title} | Orochia | Krizaka`,
    description: doc.intro ?? doc.description,
    alternates: buildAlternates(locale, `/products/orochia/docs/${slug}`),
  };
}

export default async function OrochiaDocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await load(slug);
  if (!doc) notFound();
  return (
    <article className="docs-article">
      {doc.intro && (
        <p
          style={{
            margin: "0 0 32px",
            padding: "16px 18px",
            borderRadius: "var(--kz-radius-lg)",
            border: "1px solid var(--kz-border-subtle)",
            background: "var(--kz-surface-1)",
            fontSize: 14.5,
            lineHeight: 1.6,
            color: "var(--kz-text-secondary)",
          }}
        >
          {doc.intro}
        </p>
      )}
      <div className="mdx-content-container">
        <MDXRemote
          source={doc.content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight] } }}
        />
      </div>
    </article>
  );
}
