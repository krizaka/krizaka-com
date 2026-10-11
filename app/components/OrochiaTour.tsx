"use client";

/* The Orochia tour: one switch — "I'm a fan" / "I'm a creator" — then that person's day, clip after clip
   (ProductTour). Only the chosen side is mounted, so one video plays at a time. Clips: lib/orochia-demo.ts;
   words: site.orochiaDemo.tour (labels, captions) and site.orochiaDemo.sides. */

import { useEffect, useRef, useState } from "react";
import { Tabs } from "@krizaka/ui/tabs";
import { UsersIcon, VideoIcon } from "@krizaka/icons";
import ProductTour from "./ProductTour";
import { useI18n } from "./I18nProvider";
import { CREATOR_TOUR, FAN_TOUR, tourSrc } from "@/lib/orochia-demo";

type Side = "fan" | "creator";

export default function OrochiaTour({ initial = "fan" }: { initial?: Side }) {
  const { t } = useI18n();
  const d = t.site.orochiaDemo;
  const [side, setSide] = useState<Side>(initial);
  // The recordings load only once the tour comes near the screen: they never compete with the first paint.
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const clips = (side === "fan" ? FAN_TOUR : CREATOR_TOUR).map((id) => ({ id, src: tourSrc(id), ...d.tour[id] }));

  return (
    <Tabs.Root variant="segmented" value={side} onValueChange={(v) => setSide(v as Side)} className="ot gap-5">
      <Tabs.List aria-label={d.sides.label} className="ot-sides">
        <Tabs.Trigger value="fan" className="ot-side">
          <UsersIcon size={16} /> {d.sides.fan}
        </Tabs.Trigger>
        <Tabs.Trigger value="creator" className="ot-side">
          <VideoIcon size={16} /> {d.sides.creator}
        </Tabs.Trigger>
      </Tabs.List>
      <p className="ot-lead">{side === "fan" ? d.sides.fanLead : d.sides.creatorLead}</p>
      <Tabs.Content value={side} ref={box}>
        {near ? <ProductTour key={side} clips={clips} frameLabel={d.frameLabel} /> : <div className="ot-wait" aria-hidden />}
      </Tabs.Content>
      <style>{`
        .ot-sides { margin: 0 auto; }
        .ot-side { gap: 8px; font-weight: 650; }
        .ot-wait { aspect-ratio: 16 / 10; margin-top: 52px; border-radius: 18px; border: 1px solid var(--kz-border-default); background: var(--kz-media); }
        .ot-lead { margin: 0 auto; max-width: 40rem; text-align: center; font-size: 14px; line-height: 1.6; color: var(--kz-text-secondary); }
      `}</style>
    </Tabs.Root>
  );
}
