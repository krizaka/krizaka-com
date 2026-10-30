import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n";

export const alt = "Krizaka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The social preview of every page of krizaka.com: the brand on ink and blue, one line, the family's names. */
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as "en" | "fr").site.structuredData.socialImage;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "radial-gradient(circle at 80% 20%, #1e3a8a 0%, #0d0d0f 55%), #0d0d0f",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 104, fontWeight: 900, letterSpacing: -2 }}>
        KRIZAKA<span style={{ color: "#60a5fa" }}>.</span>
      </div>
      <div style={{ marginTop: 24, fontSize: 44, fontWeight: 600, maxWidth: 960, lineHeight: 1.25 }}>{t.tagline}</div>
      <div style={{ marginTop: "auto", fontSize: 24, color: "#a1a1aa" }}>{t.line}</div>
    </div>,
    size,
  );
}
