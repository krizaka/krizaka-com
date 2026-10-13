"use client";

/* Orazaka's own composition: a chat whose answer streams in (with the call as a CodeBlock), the task that runs with
   its progress, the Studio picker, and the receipt of what stayed on the machine. The chat bubbles are plain markup
   here until the people kit of krizaka-ui (#150: Chat) is published — then they are swapped for it. */

import { useState } from "react";
import { ChoiceGrid } from "@krizaka/ui/choice-grid";
import { CodeBlock } from "@krizaka/ui/code-block";
import { Progress } from "@krizaka/ui/progress";
import { ChatIcon, ImageIcon, ServerIcon, ShieldIcon, VideoIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import { useI18n } from "../../I18nProvider";
import { KIT_ORAZAKA } from "@/lib/kit-live";
import { useStream } from "./shared";

const CALL = `curl -N -X POST "$ORAZAKA_URL/api/v1/chat/stream/support-weekly" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"message": "Summarise last week\\'s tickets"}'`;

export default function OrazakaKit() {
  const { t, locale } = useI18n();
  const k = t.site.home.build.kit.orazaka;
  const [studio, setStudio] = useState("chat");
  const a = k.answer;
  const lines = [a.intro, `1. ${a.one}`, `2. ${a.two}`, `3. ${a.three}`, a.outro];
  const { shown, done, ref } = useStream(lines.join("\n"));
  const rows = shown.split("\n");
  const { job, receipt } = KIT_ORAZAKA;
  const num = new Intl.NumberFormat(locale);

  return (
    <>
      <div className="bk-col">
        <div className="bk-card kl-chat" ref={ref}>
          <p className="bk-card-label">{k.chatLabel}</p>
          <p className="kl-bubble kl-bubble-user">{k.user}</p>
          <div className="kl-bubble kl-bubble-answer" aria-live="polite" aria-busy={!done}>
            {rows.map((row, i) => (row ? <p key={i}>{row}</p> : null))}
            {!done && <span className="kl-caret" aria-hidden />}
            {done && (
              <CodeBlock code={CALL} language="bash" file={k.codeFile} copyLabel={k.copy} copiedLabel={k.copied} highlight />
            )}
          </div>
          <p className="kl-status">{done ? k.done : k.streaming}</p>
        </div>
      </div>
      <div className="bk-col">
        <div className="bk-card kl-job">
          <p className="bk-card-label">{k.job.label}</p>
          <p className="kl-line">{format(k.job.name, { total: job.total })}</p>
          <Progress
            label={k.job.label}
            value={(job.done / job.total) * 100}
            valueText={format(k.job.progress, { done: job.done, total: job.total })}
            segments={job.total}
            showLabel
            eta={format(k.job.eta, { seconds: job.secondsLeft })}
          />
        </div>
        <ChoiceGrid
          label={k.studio.label}
          tag={k.studio.tag}
          caption={k.studio.caption}
          value={studio}
          onValueChange={setStudio}
          columns={3}
          items={[
            { id: "chat", visual: <ChatIcon size={24} aria-hidden />, name: k.studio.chat.name, title: k.studio.chat.title },
            { id: "image", visual: <ImageIcon size={24} aria-hidden />, name: k.studio.image.name, title: k.studio.image.title },
            { id: "audio", visual: <VideoIcon size={24} aria-hidden />, name: k.studio.audio.name, title: k.studio.audio.title },
          ]}
        />
        <div className="bk-card kl-receipt">
          <p className="kl-receipt-title"><ShieldIcon size={16} aria-hidden /> {k.receipt.title}</p>
          <dl>
            <div><dt>{k.receipt.model}</dt><dd>{receipt.model}</dd></div>
            <div><dt>{k.receipt.where}</dt><dd><ServerIcon size={14} aria-hidden /> {k.receipt.whereValue}</dd></div>
            <div><dt>{k.receipt.time}</dt><dd>{new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(receipt.milliseconds / 1000)} s</dd></div>
            <div><dt>{k.receipt.out}</dt><dd>{format(k.receipt.outValue, { bytes: num.format(receipt.bytesOut) })}</dd></div>
          </dl>
        </div>
      </div>
    </>
  );
}
