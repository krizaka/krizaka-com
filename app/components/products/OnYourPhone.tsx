import Link from "next/link";
import { SectionHeading } from "@krizaka/ui/page";
import { LocalIcon } from "@krizaka/icons";
import DemoClip from "@/app/components/demos/DemoClip";
import { video } from "@/lib/cdn";
import { reveal } from "@/lib/motion";

/* "On your phone": the product's iOS app in one 9:16 clip — recorded on the simulator with the demo cast, its captions
   set in the brand (site/products/<product>/mobile/promo, made in the krizaka-com#111 run) — and the way to every
   screen: the mobile docs. Words: messages → site.<page>.phone. */
export default function OnYourPhone({ product, text }: {
  product: "orochia" | "orazaka";
  text: { eyebrow: string; title: string; lead: string; label: string; docs: string };
}) {
  return (
    <section id="phone" className="kz-frame bp-wrap" style={{ scrollMarginTop: 72 }}>
      <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} align="center" reveal />
      <div {...reveal(1)}>
        <DemoClip media={video(`products/${product}/mobile/promo`)} label={text.label} bare />
      </div>
      <p className="bp-center" style={{ marginTop: 20 }}>
        <Link href={`/docs/${product}/mobile`} className="kz-link-strong">
          <LocalIcon size={16} /> {text.docs}
        </Link>
      </p>
    </section>
  );
}
