import type { ReactNode } from "react";
import Link from "next/link";
import { BackIcon } from "@krizaka/icons";
import type { MascotBird, MascotMood } from "@krizaka/ui/mascots";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import PageMascot from "./PageMascot";

/** The first screen of a sub-page: back link, eyebrow, h1, lead, and the bird of the page. Painted at once (no reveal). */
export default function PageHero({ back, eyebrow, title, lead, mascot }: { back?: { href: string; label: string }; eyebrow: ReactNode; title: string; lead: string; mascot?: { bird: MascotBird; mood?: MascotMood } }) {
  return (
    <SectionBackdrop as="header" grid>
      <div className="ps-page">
        <div className="ps-hero">
          <div>
            {back && (
              <Link href={back.href} className="ps-back">
                <BackIcon size={14} aria-hidden /> {back.label}
              </Link>
            )}
            <p className="ps-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="ps-hero-lead">{lead}</p>
          </div>
          {mascot && <PageMascot bird={mascot.bird} mood={mascot.mood ?? "welcome"} size={112} />}
        </div>
      </div>
    </SectionBackdrop>
  );
}
