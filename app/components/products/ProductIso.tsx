import { IsoHub } from "@krizaka/ui/iso";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { PLATFORM_FEE_PERCENTAGE, SPLIT_EXAMPLES, formatUsd } from "@/lib/orochia-economics";

/* The isometric heroes of the product pages — @krizaka/ui/iso `IsoHub`, driven by data (AGENTS.md §4). The light is the
   brand's: the page wears `.brand-orazaka` / `.brand-orochia`. The stages stack at the entrance, the core breathes,
   light flows along the links; the pointer or the keyboard lifts an object and shows its name. Everything is still
   under prefers-reduced-motion and pauses off screen (MotionObserver). Words: site.<product>.iso. */

/** Orazaka: your servers under a dome — gateway, models, data, a lit orchestrator on top; chats and documents flow in,
    answers flow out. */
export function OrazakaIso({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale).site.orazakaPage.iso;
  return (
    <IsoHub
      label={t.label}
      description={t.description}
      className={className}
      dome={t.dome}
      layers={[{ label: t.layers.data }, { label: t.layers.models }, { label: t.layers.gateway, material: "accent" }]}
      core={t.core}
      satellites={[
        { label: t.satellites.chats, glyph: "dots", flow: "in" },
        { label: t.satellites.documents, glyph: "lines", flow: "in", material: "glass" },
        { label: t.satellites.answers, glyph: "arrow", flow: "out" },
      ]}
    />
  );
}

/** Orochia: the creator at the centre, on her community; the four ways fans pay converge on her, each carrying the
    product's suggested amount (lib/orochia-economics.ts), and 90 % stays hers. */
export function OrochiaIso({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale).site.orochia;
  const share = format(t.paid.percent, { value: 100 - PLATFORM_FEE_PERCENTAGE });
  const gross = Object.fromEntries(SPLIT_EXAMPLES.map(({ id, grossCents }) => [id, formatUsd(grossCents, locale)])) as Record<
    (typeof SPLIT_EXAMPLES)[number]["id"],
    string
  >;
  return (
    <IsoHub
      label={t.iso.label}
      description={format(t.iso.description, { share })}
      className={className}
      shape="hex"
      size={110}
      layers={[
        { label: t.iso.layers.community, height: 16 },
        { label: t.iso.layers.creator, height: 44, material: "accent2" },
      ]}
      core={t.iso.core}
      highlight={{ strong: share, text: t.iso.highlight }}
      satellites={[
        { label: t.iso.satellites.tips, glyph: "coin", value: gross.tip },
        { label: t.iso.satellites.unlocks, glyph: "lock", value: gross.unlock },
        { label: t.iso.satellites.auctions, glyph: "arrow", value: gross.bid },
        { label: t.iso.satellites.challenges, glyph: "flag", value: gross.pledge },
      ]}
    />
  );
}
