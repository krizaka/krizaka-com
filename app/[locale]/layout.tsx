import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import { I18nProvider } from "../components/I18nProvider";
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

export const metadata: Metadata = {
  title: {
    default: "Krizaka — IA souveraine on-premise | Loi 25 & RGPD",
    template: "%s | Krizaka",
  },
  description:
    "Krizaka développe Orasaka, un moteur d'orchestration IA multi-modal open source. Déployez une IA locale avec Ollama, conforme à la Loi 25 du Québec et au RGPD, sans dépendance cloud.",
  keywords: [
    "IA on-premise",
    "IA locale",
    "Loi 25 Québec",
    "IA souveraine",
    "LLM local",
    "Ollama",
    "IA confidentielle",
    "RGPD IA",
    "orchestration IA",
    "open source IA",
    "IA entreprise locale",
    "Orasaka",
    "Krizaka",
    "Spring AI",
    "Java 21",
    "IA sans cloud",
    "déploiement IA local",
    "on-premise AI",
    "sovereign AI",
    "GDPR compliant AI",
    "privacy AI",
    "local LLM deployment",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://krizaka.com"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-CA": "/fr",
      "en-CA": "/en",
      "en": "/en",
      "fr": "/fr",
      "x-default": "/fr",
    },
  },
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
    title: "Krizaka — IA souveraine que vous contrôlez vraiment",
    description:
      "Déployez une IA d'entreprise sur votre infrastructure. Chat, Image, Vidéo, Voix — zéro dépendance cloud. Conforme Loi 25 et RGPD.",
    type: "website",
    url: "https://krizaka.com",
    siteName: "Krizaka",
    locale: "fr_CA",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krizaka — IA souveraine on-premise",
    description:
      "Orchestration IA multi-modale sur votre hardware. Conforme Loi 25 du Québec. Open source.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d0d0f",
};

/* ─── JSON-LD STRUCTURED DATA ─── */

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Krizaka",
  url: "https://krizaka.com",
  description:
    "Krizaka développe des outils et plateformes pour l'IA souveraine. Déployez des produits IA multi-modaux sur votre propre infrastructure.",
  foundingDate: "2024",
  knowsAbout: [
    "AI Orchestration",
    "Data Sovereignty",
    "On-Premise AI",
    "Spring AI",
    "Multi-Modal Inference",
    "Loi 25 Québec",
    "GDPR Compliance",
    "Ollama",
    "Local LLM Deployment",
  ],
  sameAs: ["https://github.com/krizaka"],
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Orasaka",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux",
  description:
    "Moteur d'orchestration IA souverain et open source. Déployez des produits IA multi-modaux — Chat, Image, Vidéo, Voix, RAG — entièrement sur votre propre infrastructure. Construit avec Java 21, Spring AI et une architecture hexagonale.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
  },
  creator: {
    "@type": "Organization",
    name: "Krizaka",
    url: "https://krizaka.com",
  },
  featureList: [
    "Pipeline d'intercepteurs à 15 nœuds",
    "IA Multi-Modale (Chat, Image, Vidéo, Voix)",
    "Intégration du protocole MCP",
    "Architecture Hexagonale avec ArchUnit",
    "Java 21 Virtual Threads",
    "Conforme Loi 25 / RGPD par architecture",
    "Compatible Ollama et modèles open source",
    "Déploiement local, cloud ou hybride",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce qu'Orasaka ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Orasaka est un moteur d'orchestration IA open source qui permet de déployer une IA multi-modale (Chat, Image, Vidéo, Voix) entièrement sur votre propre infrastructure, sans dépendance cloud.",
      },
    },
    {
      "@type": "Question",
      name: "Orasaka est-il conforme à la Loi 25 du Québec ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Orasaka est conforme par architecture : toutes les inférences IA s'exécutent localement sur votre infrastructure. Aucune donnée ne transite par des serveurs tiers.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on utiliser Ollama avec Orasaka ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Orasaka supporte nativement Ollama, LocalAI et tout modèle open source. L'orchestration route intelligemment les requêtes vers le modèle optimal.",
      },
    },
    {
      "@type": "Question",
      name: "Orasaka est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le cœur d'Orasaka est open source et gratuit. Des packages d'intercepteurs avancés et de pipelines seront disponibles en option payante pour les entreprises.",
      },
    },
  ],
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
    >
      <head>
        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {/* JSON-LD: SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareJsonLd),
          }}
        />
        {/* JSON-LD: FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
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
