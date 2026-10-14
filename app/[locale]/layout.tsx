import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider, ThemeScript } from "@krizaka/ui/theme";
import { ThemeSync } from "../components/SiteTheme";
import { I18nProvider } from "../components/I18nProvider";
import { JsonLd } from "../components/JsonLd";
import { buildSiteGraph } from "@/lib/structured-data";
import { getDictionary } from "@/lib/i18n";
import { CDN_URL } from "@/lib/cdn";
import { SITE_URL } from "@/lib/site";
import "../globals.css";
/* The page blocks of @krizaka/ui (AGENTS.md §4.1): their stylesheet, imported by package path from the layout — never by
   a relative @import inside globals.css, which the production build dropped (#74). */
import "@krizaka/ui/blocks.css";
/* The storytelling kit of @krizaka/ui (/story, and its live examples on /docs/ui): its stylesheet, the same way. */
import "@krizaka/ui/story.css";
import { MotionObserver } from "@krizaka/ui/motion";
import { cn } from "@krizaka/ui/cn";

/* The Krizaka typefaces — the files of @krizaka/fonts (SIL OFL 1.1), loaded by next/font/local so the two faces of the
   first screen are preloaded and fingerprinted, with next/font's metric-adjusted fallback (CLS 0). The latin file of
   each family covers English and French; globals.css puts them in the token roles (--kz-font-*). The arguments must be
   literals, relative to this file.
   LCP: the first screen is text (a hero's h1 and lead), so the two preloaded faces use `display: "optional"` — the text
   is painted once, in the brand face when it arrives within the block period (the usual case: preloaded, 25–50 kB),
   else in the metric-adjusted fallback for this visit only (cached for the next). With `swap`, a late face repainted
   the hero and moved the LCP by seconds on a slow phone. */
const textFace = localFont({
  src: "../../node_modules/@krizaka/fonts/files/web/inter-latin-wght.woff2",
  weight: "400 700",
  variable: "--font-kz-text",
  display: "optional",
});
const displayFace = localFont({
  src: "../../node_modules/@krizaka/fonts/files/web/plus-jakarta-sans-latin-wght.woff2",
  weight: "500 800",
  variable: "--font-kz-display",
  display: "optional",
});
const monoFace = localFont({
  src: "../../node_modules/@krizaka/fonts/files/web/jetbrains-mono-latin-wght.woff2",
  weight: "400 700",
  variable: "--font-kz-mono",
  display: "swap",
  preload: false, // labels and code, never the first paint
  adjustFontFallback: false,
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
});

/* ─── SEO METADATA ─── */

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: {
      default: isEn
        ? "Krizaka — open-source software studio in Montréal"
        : "Krizaka — studio logiciel open source à Montréal",
      template: "%s | Krizaka",
    },
    description: isEn
      ? "Krizaka is an open-source software studio in Montréal, Québec. Krizaka UI and Krizaka Java, the building blocks of its products — Orazaka, Orochia, Yazakia, Yororis — each on its own site."
      : "Krizaka est un studio logiciel open source à Montréal, au Québec. Krizaka UI et Krizaka Java, les briques de ses produits — Orazaka, Orochia, Yazakia, Yororis — chacun sur son propre site.",
    keywords: [
      "studio logiciel open source Montréal",
      "design system React",
      "Krizaka UI",
      "Krizaka Java",
      "Spring Boot",
      "Loi 25 Québec",
      "IA souveraine Canada",
      "Krizaka Montréal",
      "open-source software studio Montreal",
      "React design system",
      "Spring Boot building blocks",
      "sovereign AI Quebec",
    ],
    icons: {
      icon: "/favicon.svg",
    },
    metadataBase: new URL(SITE_URL),
    // Canonical + hreflang are set per page (see lib/seo buildAlternates), so a
    // subpage never inherits the homepage's canonical.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: isEn ? "Krizaka — open-source software studio" : "Krizaka — studio logiciel open source à Montréal",
      description: isEn
        ? "Krizaka UI, Krizaka Java and four products built on them — all open source, made in Montréal."
        : "Krizaka UI, Krizaka Java et quatre produits construits dessus — tout en open source, fait à Montréal.",
      type: "website",
      url: SITE_URL,
      siteName: "Krizaka",
      locale: isEn ? "en_US" : "fr_CA",
      alternateLocale: isEn ? "fr_CA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "Krizaka — open-source software studio" : "Krizaka — studio logiciel open source à Montréal",
      description: isEn
        ? "Krizaka UI, Krizaka Java and four products built on them. Open source, made in Montréal."
        : "Krizaka UI, Krizaka Java et quatre produits construits dessus. Open source, fait à Montréal.",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d0d0f",
};

/* ─── ROOT LAYOUT ─── */

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const validatedLocale = locale === "en" || locale === "fr" ? locale : "en";

  return (
    <html
      lang={validatedLocale}
      className={cn(textFace.variable, displayFace.variable, monoFace.variable, "h-full dark")}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Applies the persisted theme (`kz-theme`), else the site's default — dark — before the first paint: no flash.
            The same defaultMode as the provider below. */}
        <ThemeScript defaultMode="dark" />
        {/* The recordings, posters and gallery come from Bunny (lib/cdn.ts): open the connection early. */}
        <link rel="preconnect" href={CDN_URL} />
        {/* Sitewide linked @graph: Organization · WebSite · SoftwareApplication.
            Page-scoped schema (BreadcrumbList, FAQPage) is emitted per page. */}
        <JsonLd data={buildSiteGraph(validatedLocale)} />
        {/* Without JavaScript nothing waits to be revealed (@krizaka/ui motion.css, MotionObserver). */}
        <noscript>
          <style>{"[data-reveal],.bp-term pre>div{opacity:1!important;transform:none!important;filter:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        <ThemeProvider defaultMode="dark">
          <ThemeSync />
          <I18nProvider locale={validatedLocale} messages={getDictionary(validatedLocale)}>
            {children}
          </I18nProvider>
          {/* The Krizaka motion conductor (@krizaka/ui/motion): reveals, off-screen pause, settle, pointer — no rAF loop. */}
          <MotionObserver />
        </ThemeProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}
