import { Children, isValidElement } from "react";
import Mermaid from "./Mermaid";
import CopyCodeBlock from "./CopyCodeBlock";

/* ═══════════════════════════════════════════════════════════════════
   MdxComponents — Premium rendering overrides for MDXRemote
   Aligned with Krizaka's glassmorphic design system
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Doc link mapping: docs/FILE.md → /products/orasaka/category/slug ─── */
const DOC_LINK_MAP: Record<string, string> = {
  "101": "/products/orasaka/getting-started/101",
  "101.md": "/products/orasaka/getting-started/101",
  "architecture": "/products/orasaka/architecture/architecture",
  "architecture.md": "/products/orasaka/architecture/architecture",
  "core": "/products/orasaka/architecture/core",
  "core.md": "/products/orasaka/architecture/core",
  "models": "/products/orasaka/architecture/models",
  "models.md": "/products/orasaka/architecture/models",
  "api_reference": "/products/orasaka/api/api_reference",
  "api_reference.md": "/products/orasaka/api/api_reference",
  "cli": "/products/orasaka/api/cli",
  "cli.md": "/products/orasaka/api/cli",
  "auth": "/products/orasaka/core-features/auth",
  "auth.md": "/products/orasaka/core-features/auth",
  "automation": "/products/orasaka/core-features/automation",
  "automation.md": "/products/orasaka/core-features/automation",
  "business_implementation": "/products/orasaka/core-features/business_implementation",
  "business_implementation.md": "/products/orasaka/core-features/business_implementation",
  "master_features": "/products/orasaka/core-features/master_features",
  "master_features.md": "/products/orasaka/core-features/master_features",
  "deploy": "/products/orasaka/operations/deploy",
  "deploy.md": "/products/orasaka/operations/deploy",
  "glossary": "/products/orasaka/guidelines/glossary",
  "glossary.md": "/products/orasaka/guidelines/glossary",
  // Excluded from the public site (internal/contributor docs): agents, context,
  // end2end_test, ui_reference — intentionally NOT mapped so links don't 404.
};

function resolveDocLink(href: string): string {
  if (!href) return href;
  
  // Handle docs/FILE.md or docs/FILE.md#section
  const docsMatch = href.match(/^(?:\.\/)?docs\/([^#]+?)(?:\.md)?(?:#(.+))?$/i);
  if (docsMatch) {
    const file = docsMatch[1].toLowerCase();
    const hash = docsMatch[2] ? `#${docsMatch[2]}` : "";
    const mapped = DOC_LINK_MAP[file] || DOC_LINK_MAP[file + ".md"];
    if (mapped) return mapped + hash;
  }
  
  // Handle bare FILE.md references (from within docs/)
  const bareMatch = href.match(/^([A-Z_]+)\.md(?:#(.+))?$/i);
  if (bareMatch) {
    const file = bareMatch[1].toLowerCase();
    const hash = bareMatch[2] ? `#${bareMatch[2]}` : "";
    const mapped = DOC_LINK_MAP[file] || DOC_LINK_MAP[file + ".md"];
    if (mapped) return mapped + hash;
  }

  return href;
}

/* ─── Table ─── */
function MdxTable(props: any) {
  return (
    <div
      style={{
        margin: "32px 0",
        borderRadius: "var(--kz-radius-lg)",
        border: "1px solid var(--kz-border-subtle)",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.02)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          {...props}
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: 13.5,
            fontFamily: "var(--font-display)",
          }}
        />
      </div>
    </div>
  );
}

function MdxThead(props: any) {
  return (
    <thead
      {...props}
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        borderBottom: "1px solid var(--kz-border-subtle)",
      }}
    />
  );
}

function MdxTh(props: any) {
  return (
    <th
      {...props}
      style={{
        padding: "14px 16px",
        textAlign: "left",
        fontWeight: 650,
        color: "var(--kz-text-primary)",
        letterSpacing: "-0.01em",
        borderBottom: "1px solid var(--kz-border-subtle)",
      }}
    />
  );
}

function MdxTd(props: any) {
  return (
    <td
      {...props}
      style={{
        padding: "12px 16px",
        color: "var(--kz-text-secondary)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        lineHeight: 1.5,
      }}
    />
  );
}

function MdxTr(props: any) {
  return (
    <tr
      {...props}
      style={{
        transition: "background 0.2s ease",
      }}
      className="mdx-table-row"
    />
  );
}

/* ─── Status badge detection for emoji → premium pill ─── */
const STATUS_PATTERNS: Array<{
  emoji: string;
  color: string;
  bgColor: string;
  dotColor: string;
}> = [
  { emoji: "🟢", color: "hsl(160, 84%, 39%)", bgColor: "hsla(160, 84%, 39%, 0.08)", dotColor: "hsl(160, 84%, 50%)" },
  { emoji: "✅", color: "hsl(160, 84%, 39%)", bgColor: "hsla(160, 84%, 39%, 0.08)", dotColor: "hsl(160, 84%, 50%)" },
  { emoji: "🟡", color: "hsl(38, 92%, 50%)", bgColor: "hsla(38, 92%, 50%, 0.08)", dotColor: "hsl(38, 92%, 55%)" },
  { emoji: "⏳", color: "hsl(38, 92%, 50%)", bgColor: "hsla(38, 92%, 50%, 0.08)", dotColor: "hsl(38, 92%, 55%)" },
  { emoji: "🟠", color: "hsl(25, 95%, 53%)", bgColor: "hsla(25, 95%, 53%, 0.08)", dotColor: "hsl(25, 95%, 58%)" },
  { emoji: "🗓️", color: "hsl(270, 60%, 60%)", bgColor: "hsla(270, 60%, 60%, 0.08)", dotColor: "hsl(270, 60%, 65%)" },
  { emoji: "🔴", color: "hsl(0, 84%, 60%)", bgColor: "hsla(0, 84%, 60%, 0.08)", dotColor: "hsl(0, 84%, 65%)" },
  { emoji: "❌", color: "hsl(0, 84%, 60%)", bgColor: "hsla(0, 84%, 60%, 0.08)", dotColor: "hsl(0, 84%, 65%)" },
  { emoji: "🔵", color: "hsl(217, 92%, 60%)", bgColor: "hsla(217, 92%, 60%, 0.08)", dotColor: "hsl(217, 92%, 65%)" },
  { emoji: "🚀", color: "hsl(217, 92%, 60%)", bgColor: "hsla(217, 92%, 60%, 0.08)", dotColor: "hsl(217, 92%, 65%)" },
];

/** Recursively extract plain text from React children */
function extractPlainText(node: any): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractPlainText).join("");
  if (isValidElement(node)) {
    return extractPlainText((node as any).props?.children);
  }
  return "";
}

function renderBadge(text: string, pattern: typeof STATUS_PATTERNS[0]) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px 3px 8px",
        borderRadius: 20,
        background: pattern.bgColor,
        border: `1px solid ${pattern.color}20`,
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        color: pattern.color,
        letterSpacing: "0.02em",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: pattern.dotColor,
          boxShadow: `0 0 6px ${pattern.dotColor}60`,
          flexShrink: 0,
        }}
      />
      {text}
    </span>
  );
}

function transformStatusChildren(children: any): any {
  // Extract the full plain text to check for emoji patterns
  const fullText = extractPlainText(children);

  for (const pattern of STATUS_PATTERNS) {
    if (fullText.includes(pattern.emoji)) {
      const cleanText = fullText.replace(pattern.emoji, "").replace(/\*\*/g, "").trim();
      return renderBadge(cleanText, pattern);
    }
  }

  return children;
}

/* ─── Blockquote ─── */
function MdxBlockquote(props: any) {
  const text = extractPlainText(props.children);
  let variant = "default";
  let borderColor = "var(--kz-border-subtle)";
  let bgColor = "rgba(255, 255, 255, 0.03)";

  if (text.includes("[!WARNING]") || text.includes("[!CAUTION]") || text.includes("WARNING") || text.includes("⚠️")) {
    variant = "warning";
    borderColor = "hsl(45, 100%, 50%)";
    bgColor = "hsla(45, 100%, 50%, 0.08)";
  }
  if (text.includes("[!ERROR]") || text.includes("[!DANGER]") || text.includes("ERROR") || text.includes("❌")) {
    variant = "critical";
    borderColor = "var(--kz-status-error)";
    bgColor = "hsla(0, 84%, 60%, 0.08)";
  }
  if (text.includes("[!NOTE]") || text.includes("[!TIP]") || text.includes("[!IMPORTANT]") || text.includes("NOTE") || text.includes("💡") || text.includes("TIP")) {
    variant = "note";
    borderColor = "var(--kz-accent)";
    bgColor = "rgba(var(--kz-accent-rgb), 0.08)";
  }

  return (
    <blockquote
      data-variant={variant}
      style={{
        margin: "28px 0",
        padding: "16px 20px",
        borderLeft: `4px solid ${borderColor}`,
        background: bgColor,
        borderRadius: "0 var(--kz-radius-md) var(--kz-radius-md) 0",
        fontSize: 14,
        color: "var(--kz-text-secondary)",
        lineHeight: 1.6,
        position: "relative",
      }}
      {...props}
    />
  );
}

/* ─── Horizontal Rule ─── */
function MdxHr() {
  return (
    <hr
      style={{
        margin: "32px 0",
        border: "none",
        height: 1,
        background: "var(--kz-border-subtle)",
      }}
    />
  );
}

/** A mermaid chart must begin with a known diagram keyword. Guards against
 *  garbage (e.g. tokenized highlight output) reaching the renderer. */
const MERMAID_RE =
  /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|sankey|xychart)\b/;

function isValidMermaid(chart: string): boolean {
  const first = chart.trim().split("\n", 1)[0]?.trim() ?? "";
  return MERMAID_RE.test(first);
}

/* ─── Pre / Code + Mermaid ─── */
function MdxPre(props: any) {
  const children = props.children;
  let child: any = null;
  try {
    child = Children.only(children);
  } catch {
    // Multiple children or non-element children
  }

  if (child && isValidElement(child)) {
    const childProps = (child as any).props;
    const className = childProps?.className || "";

    // Detect Mermaid — extract text recursively (rehype-highlight tokenizes the
    // code block into element spans, so String(children) would be garbage).
    if (className.includes("language-mermaid")) {
      const content = extractPlainText(childProps.children).trim();
      if (isValidMermaid(content)) {
        return <Mermaid chart={content} />;
      }
      // Invalid/empty chart → safe plain code block, never crash.
      return (
        <CopyCodeBlock language="mermaid">
          <pre style={{ fontSize: 13, lineHeight: 1.6, fontFamily: "var(--font-mono)", overflowX: "auto", margin: 0 }}>
            {content}
          </pre>
        </CopyCodeBlock>
      );
    }

    // Extract language for header label
    const langMatch = className.match(/language-(\w+)/);
    const language = langMatch ? langMatch[1] : undefined;

    // Detect ASCII art diagrams (box-drawing, arrows, tree chars)
    if (!language) {
      const text = extractPlainText(childProps.children);
      const boxChars = /[┌┐└┘├┤┬┴│─═║╔╗╚╝╠╣╦╩►◄▶▷→←↓↑⟶⟵]/;
      if (boxChars.test(text)) {
        return (
          <div
            style={{
              margin: "24px 0",
              borderRadius: "var(--kz-radius-lg)",
              border: "1px solid var(--kz-border-subtle)",
              overflow: "hidden",
              background: "var(--kz-surface-1)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderBottom: "1px solid var(--kz-border-subtle)",
                background: "var(--kz-surface-2)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--kz-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 750, color: "var(--kz-accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                System Architecture
              </span>
            </div>
            <div style={{ padding: "24px", overflowX: "auto", background: "rgba(0,0,0,0.15)" }}>
              <pre
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  fontFamily: "var(--font-mono)",
                  color: "var(--kz-text-primary)",
                  opacity: 0.95,
                  margin: 0,
                  whiteSpace: "pre",
                }}
              >
                {child}
              </pre>
            </div>
          </div>
        );
      }
    }

    return (
      <CopyCodeBlock language={language}>
        <pre
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            fontFamily: "var(--font-mono)",
            overflowX: "auto",
            margin: 0,
          }}
        >
          {child}
        </pre>
      </CopyCodeBlock>
    );
  }

  return (
    <CopyCodeBlock>
      <pre
        {...props}
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          fontFamily: "var(--font-mono)",
          overflowX: "auto",
          margin: 0,
        }}
      />
    </CopyCodeBlock>
  );
}

/* ─── Image ─── */
function MdxImg(props: any) {
  let src = props.src || "";

  // Rewrite relative paths for documentation assets
  if (src.startsWith("docs/assets/")) {
    src = src.replace("docs/assets/", "/assets/orasaka/");
  } else if (src.startsWith("assets/")) {
    src = src.replace("assets/", "/assets/orasaka/");
  } else if (
    !src.startsWith("http") &&
    !src.startsWith("/") &&
    !src.startsWith("data:")
  ) {
    // If it's a relative path from within a doc file
    src = "/assets/orasaka/" + src;
  }

  return (
    <span
      style={{
        display: "block",
        margin: "24px 0",
        borderRadius: "var(--kz-radius-md)",
        overflow: "hidden",
        border: "1px solid var(--kz-border-subtle)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        src={src}
        alt={props.alt || ""}
        loading="lazy"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
      />
      {props.alt && (
        <span
          style={{
            display: "block",
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--kz-text-muted)",
            textAlign: "center",
            background: "var(--kz-surface-2)",
          }}
        >
          {props.alt}
        </span>
      )}
    </span>
  );
}

/* ─── Headings ─── */
function MdxH1(props: any) {
  return (
    <h1
      {...props}
      style={{
        fontSize: 34,
        fontWeight: 800,
        fontFamily: "var(--font-display)",
        letterSpacing: "-0.04em",
        color: "var(--kz-text-primary)",
        lineHeight: 1.15,
        marginTop: 0,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "1px solid var(--kz-border-subtle)",
      }}
    />
  );
}

function MdxH2(props: any) {
  return (
    <h2
      {...props}
      style={{
        fontSize: 24,
        fontWeight: 700,
        fontFamily: "var(--font-display)",
        letterSpacing: "-0.03em",
        color: "var(--kz-text-primary)",
        lineHeight: 1.25,
        marginTop: 56,
        marginBottom: 16,
      }}
    />
  );
}

function MdxH3(props: any) {
  return (
    <h3
      {...props}
      style={{
        fontSize: 18,
        fontWeight: 650,
        fontFamily: "var(--font-display)",
        letterSpacing: "-0.02em",
        color: "var(--kz-text-primary)",
        lineHeight: 1.4,
        marginTop: 36,
        marginBottom: 12,
      }}
    />
  );
}

/* ─── Paragraph ─── */
function MdxP(props: any) {
  return (
    <p
      {...props}
      style={{
        fontSize: 15.5,
        lineHeight: 1.7,
        color: "var(--kz-text-secondary)",
        marginBottom: 20,
      }}
    />
  );
}

/* ─── Lists ─── */
function MdxUl(props: any) {
  return (
    <ul
      {...props}
      style={{
        paddingLeft: 20,
        marginBottom: 16,
        fontSize: 14.5,
        lineHeight: 1.7,
        color: "var(--kz-text-secondary)",
      }}
    />
  );
}

function MdxOl(props: any) {
  return (
    <ol
      {...props}
      style={{
        paddingLeft: 20,
        marginBottom: 16,
        fontSize: 14.5,
        lineHeight: 1.7,
        color: "var(--kz-text-secondary)",
      }}
    />
  );
}

function MdxLi(props: any) {
  return (
    <li
      {...props}
      style={{
        marginBottom: 4,
      }}
    />
  );
}

/* ─── Inline Code ─── */
function MdxInlineCode(props: any) {
  return (
    <code
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.88em",
        padding: "2px 6px",
        borderRadius: 4,
        background: "var(--kz-surface-2)",
        border: "1px solid var(--kz-border-subtle)",
        color: "var(--kz-accent)",
      }}
    />
  );
}

/* ─── Link (with doc path rewriting) ─── */
function MdxA(props: any) {
  const href = resolveDocLink(props.href || "");
  return (
    <a
      {...props}
      href={href}
      style={{
        color: "var(--kz-accent)",
        textDecoration: "none",
        borderBottom: "1px solid hsla(217, 92%, 60%, 0.3)",
      }}
    />
  );
}

/* ─── Strong / Em ─── */
function MdxStrong(props: any) {
  return (
    <strong
      {...props}
      style={{
        fontWeight: 600,
        color: "var(--kz-text-primary)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════ */

export const mdxComponents = {
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  p: MdxP,
  ul: MdxUl,
  ol: MdxOl,
  li: MdxLi,
  a: MdxA,
  strong: MdxStrong,
  code: MdxInlineCode,
  pre: MdxPre,
  table: MdxTable,
  thead: MdxThead,
  th: MdxTh,
  td: MdxTd,
  tr: MdxTr,
  blockquote: MdxBlockquote,
  hr: MdxHr,
  img: MdxImg,
  style: () => (
    <style>{`
      .mdx-table-row:hover {
        background: rgba(255, 255, 255, 0.04) !important;
      }
      .docs-article h1, .docs-article h2, .docs-article h3 {
        scroll-margin-top: 100px;
      }
      .docs-article ul, .docs-article ol {
        padding-left: 20px;
        margin-bottom: 24px;
      }
      .docs-article li {
        color: var(--kz-text-secondary);
        font-size: 15px;
        line-height: 1.7;
        margin-bottom: 8px;
      }
      .docs-article blockquote p:last-child {
        margin-bottom: 0;
      }
    `}</style>
  ),
};
