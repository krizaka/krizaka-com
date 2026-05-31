import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import { I18nProvider } from "../components/I18nProvider";
import { JsonLd } from "../components/JsonLd";
import { buildSiteGraph } from "@/lib/structured-data";
import "../globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
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
        ? "Krizaka — Sovereign On-Premise AI | Law 25 & GDPR Compliance" 
        : "Krizaka — IA souveraine on-premise | Loi 25 & RGPD Montréal",
      template: "%s | Krizaka",
    },
    description: isEn
      ? "Krizaka designs Orazaka, an open-source multi-modal AI orchestration engine. Deploy local LLMs in Montreal, Quebec with Ollama, conforming to Law 25 and GDPR."
      : "Krizaka développe Orazaka, un moteur d'orchestration IA souverain et open source à Montréal. Déployez une IA locale conforme à la Loi 25 du Québec et au RGPD.",
    keywords: [
      "IA on-premise Montréal",
      "IA locale Québec",
      "Loi 25 Québec",
      "Loi 25 IA Montréal",
      "IA souveraine Canada",
      "LLM local Montréal",
      "Ollama Montréal",
      "IA confidentielle Québec",
      "RGPD IA Canada",
      "orchestration IA Montréal",
      "open source IA Québec",
      "Krizaka Montréal",
      "Orazaka Montréal",
      "Spring AI",
      "Java 21",
      "local LLM deployment",
      "on-premise AI Montreal",
      "sovereign AI Quebec",
      "GDPR compliant AI Canada",
      "privacy AI Montreal",
    ],
    icons: {
      icon: "/favicon.svg",
    },
    metadataBase: new URL("https://krizaka.com"),
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
      title: isEn
        ? "Krizaka — Sovereign AI you truly control"
        : "Krizaka — IA souveraine que vous contrôlez vraiment à Montréal",
      description: isEn
        ? "Deploy sovereign AI on your own infrastructure. Chat, Image, Video, Voice — zero cloud dependencies. Law 25 and GDPR compliant."
        : "Déployez une IA souveraine sur votre infrastructure à Montréal. Chat, Image, Vidéo, Voix — zéro dépendance cloud. Conforme Loi 25 et RGPD.",
      type: "website",
      url: "https://krizaka.com",
      siteName: "Krizaka",
      locale: isEn ? "en_US" : "fr_CA",
      alternateLocale: isEn ? "fr_CA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isEn
        ? "Krizaka — Sovereign On-Premise AI"
        : "Krizaka — IA souveraine on-premise Montréal",
      description: isEn
        ? "Multi-modal AI orchestration on your own hardware. Law 25 & GDPR compliant. Open source."
        : "Orchestration IA multi-modale sur votre propre matériel à Montréal. Conforme Loi 25 du Québec. Open source.",
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
  const validatedLocale = locale === "en" || locale === "fr" ? locale : "fr";

  return (
    <html
      lang={validatedLocale}
      className={`${jakartaSans.variable} ${jetbrainsMono.variable} h-full dark`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Sitewide linked @graph: Organization · WebSite · SoftwareApplication.
            Page-scoped schema (BreadcrumbList, FAQPage) is emitted per page. */}
        <JsonLd data={buildSiteGraph(validatedLocale)} />
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        <ThemeProvider>
          <I18nProvider locale={validatedLocale}>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}
