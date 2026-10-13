"use client";

/* One kit, four identities — and four compositions. Switching the product re-wears the stage in its brand
   (`.brand-<id>`, @krizaka/tokens/brands/scoped.css) and shows the components that product really uses, with data
   shaped like its own (app/components/home/kit/*): Orazaka's streamed chat, task and receipt; Orochia's creator,
   auction and goal in CAD; Yazakia's three people and their reasons; Yororis's moment, in its lexicon. Nothing is
   drawn by the site: change a component in krizaka-ui, release it, and this stage shows it. Words: site.home.build.kit. */

import { useState } from "react";
import { Chip } from "@krizaka/ui/chip";
import { ProductLogo } from "@krizaka/ui";
import { ForwardIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import ButtonLink from "../ButtonLink";
import { useI18n } from "../I18nProvider";
import { useContactHref } from "../useContactHref";
import { NAV_PRODUCTS } from "@/lib/nav";
import OrazakaKit from "./kit/OrazakaKit";
import OrochiaKit from "./kit/OrochiaKit";
import YazakiaKit from "./kit/YazakiaKit";
import YororisKit from "./kit/YororisKit";
import "./kit/kit.css";

/** The identities the showcase switches between: the products, in the site's order (lib/nav.ts). */
const SHOWCASE_BRANDS = NAV_PRODUCTS.map((p) => ({ id: p.id, name: p.name }));
type ShowcaseBrand = (typeof SHOWCASE_BRANDS)[number]["id"];

export default function KitShowcase({ portraits }: { portraits: Record<string, string> }) {
  const { t } = useI18n();
  const k = t.site.home.build.kit;
  const contact = useContactHref("blocks");
  const [brand, setBrand] = useState<ShowcaseBrand>(SHOWCASE_BRANDS[0].id);
  const brandName = SHOWCASE_BRANDS.find((b) => b.id === brand)?.name ?? brand;

  return (
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

      <div key={brand} className={"bk-stage kl-stage brand-" + brand} role="group" aria-label={format(k.stageLabel, { brand: brandName })}>
        {brand === "orazaka" && <OrazakaKit />}
        {brand === "orochia" && <OrochiaKit portraits={portraits} />}
        {brand === "yazakia" && <YazakiaKit portraits={portraits} />}
        {brand === "yororis" && <YororisKit />}
      </div>
      <div className="bk-actions kl-foot">
        <ButtonLink href="/docs/ui" variant="primary" shimmer>
          {k.primary} <ForwardIcon size={14} aria-hidden />
        </ButtonLink>
        <ButtonLink href={contact}>{k.secondary}</ButtonLink>
      </div>
    </div>
  );
}
