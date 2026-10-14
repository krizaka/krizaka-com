"use client";

/* One kit, four identities: a gallery of Krizaka UI's own components — each with its name, a hint of its variants and
   a link to its page — and the phone that shows their native versions. Each identity leads with the components its
   product really uses (lib/kit-live.ts: KIT_SETS), after a short common core; the switch re-themes the stage
   (`.brand-<id>`, @krizaka/tokens/brands/scoped.css) and picks the phone's loop. Nothing here is drawn by the site:
   change a component in krizaka-ui, release it, and this stage shows it. Words: site.home.build.kit. */

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Chip } from "@krizaka/ui/chip";
import { ProductLogo } from "@krizaka/ui";
import type { TerminalStep } from "@krizaka/ui/terminal-replay";
import { Toaster } from "@krizaka/ui/toast";
import { ForwardIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import type { Video } from "@/lib/cdn";
import ButtonLink from "../ButtonLink";
import { useI18n } from "../I18nProvider";
import { useContactHref } from "../useContactHref";
import { NAV_PRODUCTS } from "@/lib/nav";
import { KIT_SETS, KIT_TILES, type KitTileId } from "@/lib/kit-live";
import type { KitMedia } from "@/lib/kit-media";
import CoreTile from "./kit/tiles-core";
import OrazakaTile from "./kit/tiles-orazaka";
import NativePhone from "./kit/NativePhone";
import "./kit/kit.css";

/** The identities the showcase switches between: the products, in the site's order (lib/nav.ts). */
const SHOWCASE_BRANDS = NAV_PRODUCTS.map((p) => ({ id: p.id, name: p.name }));
type ShowcaseBrand = (typeof SHOWCASE_BRANDS)[number]["id"];

// What only one product uses is loaded when its identity is chosen: the media and the map engines are the heavy parts.
const OrochiaTile = dynamic(() => import("./kit/tiles-orochia"), { ssr: false });
const YazakiaTile = dynamic(() => import("./kit/tiles-yazakia"), { ssr: false });
const GROUP: Partial<Record<KitTileId, "orazaka" | "orochia" | "yazakia">> = {
  chat: "orazaka", "code-block": "orazaka", stepper: "orazaka", "choice-grid": "orazaka", "terminal-replay": "orazaka",
  "video-player": "orochia", "video-trimmer": "orochia", "image-cropper": "orochia", "media-capture": "orochia", countdown: "orochia", "goal-gauge": "orochia", sparkline: "orochia",
  "swipe-deck": "yazakia", "match-dialog": "yazakia", "tag-selector": "yazakia", "location-picker": "yazakia", map: "yazakia",
};

export default function KitShowcase({ media, phones, terminal }: { media: KitMedia; phones: Record<string, Video>; terminal: readonly TerminalStep[] }) {
  const { t } = useI18n();
  const k = t.site.home.build.kit;
  const contact = useContactHref("blocks");
  const [brand, setBrand] = useState<ShowcaseBrand>(SHOWCASE_BRANDS[0].id);
  const brandName = SHOWCASE_BRANDS.find((b) => b.id === brand)?.name ?? brand;

  const tile = (id: KitTileId) => {
    const props = { id, media, terminal, brand };
    switch (GROUP[id]) {
      case "orazaka": return <OrazakaTile {...props} />;
      case "orochia": return <OrochiaTile {...props} />;
      case "yazakia": return <YazakiaTile {...props} />;
      default: return <CoreTile {...props} />;
    }
  };

  return (
    <div className="bk-grid">
      <div className="bk-kit">
        <div className="bk-kit-bar">
          <h3>{k.title}</h3>
          <Chip.Group type="single" required label={k.brandLabel} value={brand} onValueChange={(v) => v && setBrand(v as ShowcaseBrand)} size="sm" className="bk-brands">
            {SHOWCASE_BRANDS.map((b) => (
              <Chip key={b.id} value={b.id}>
                <ProductLogo id={b.id} size={14} animated={false} />
                {b.name}
              </Chip>
            ))}
          </Chip.Group>
        </div>

        <div key={brand} className={"kl-stage brand-" + brand} role="group" aria-label={format(k.stageLabel, { brand: brandName })}>
          {KIT_SETS[brand].map((id) => (
            <section key={id} className="bk-card kl-tile" data-tile={id}>
              <header className="kl-tile-head">
                <Link href={`/docs/ui/${KIT_TILES[id].doc}`} className="kl-tile-name" aria-label={format(k.open, { name: KIT_TILES[id].name })}>{KIT_TILES[id].name}</Link>
                <span className="kl-muted">{k.tiles[id]}</span>
              </header>
              {tile(id)}
            </section>
          ))}
          <Toaster label={k.toast.label} closeLabel={k.toast.close} />
        </div>
        <div className="bk-actions kl-foot">
          <ButtonLink href="/docs/ui" variant="primary" shimmer>
            {k.primary} <ForwardIcon size={14} aria-hidden />
          </ButtonLink>
          <ButtonLink href={contact}>{k.secondary}</ButtonLink>
        </div>
      </div>
      <div className={"brand-" + brand}>
        <NativePhone phones={phones} brand={brand} brandName={brandName} />
      </div>
    </div>
  );
}
