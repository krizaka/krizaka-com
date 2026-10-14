"use client";

/* The vertical clip of "Krizaka UI, live": a VideoPlayer in 9:16 with the actions of a short over it — an avatar, like,
   comment, share, tip on the right; the creator and a caption bottom-left — composed from Button, Avatar and Badge
   on the scrim tokens. (To be swapped for krizaka-ui's VerticalVideo/ShortFeed once released: krizaka-ui#170.) */

import { useState } from "react";
import { Avatar } from "@krizaka/ui/avatar";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { VideoPlayer, type VideoPlayerProps } from "@krizaka/ui/video-player";
import { HeartIcon, MessageIcon, Share90Icon, TipIcon } from "@krizaka/icons";
import { useI18n } from "../../I18nProvider";
import { KIT_SHORT } from "@/lib/kit-live";

export default function ShortClip(props: Pick<VideoPlayerProps, "src" | "poster" | "title" | "labels"> & { avatar: string }) {
  const { t, locale } = useI18n();
  const s = t.site.home.build.kit.short;
  const [liked, setLiked] = useState(false);
  const count = (n: number) => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
  const { avatar, ...player } = props;
  return (
    <div className="kl-short">
      <VideoPlayer {...player} aspectRatio="9 / 16" />
      <div className="kl-short-rail">
        <Avatar src={avatar} alt={s.creator} size="md" />
        <Button type="button" variant="ghost" size="icon" className="kl-short-btn" aria-label={s.like} aria-pressed={liked} onClick={() => setLiked((v) => !v)}>
          <HeartIcon aria-hidden />
        </Button>
        <span className="kl-short-n">{count(KIT_SHORT.likes + (liked ? 1 : 0))}</span>
        <Button type="button" variant="ghost" size="icon" className="kl-short-btn" aria-label={s.comment}><MessageIcon aria-hidden /></Button>
        <span className="kl-short-n">{count(KIT_SHORT.comments)}</span>
        <Button type="button" variant="ghost" size="icon" className="kl-short-btn" aria-label={s.share}><Share90Icon aria-hidden /></Button>
        <Button type="button" variant="ghost" size="icon" className="kl-short-btn" aria-label={s.tip}><TipIcon aria-hidden /></Button>
      </div>
      <div className="kl-short-caption">
        <strong>@{s.creator}</strong>
        <span>{s.caption}</span>
        <Badge tone="scrim" size="sm">{s.tag}</Badge>
      </div>
    </div>
  );
}
