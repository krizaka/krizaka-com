"use client";

/* Orazaka's tiles: the chat (the answer streams in), the call as a CodeBlock, a job in steps, the Studio choice and
   the terminal session replayed. */

import { useState } from "react";
import { MessageBubble, MessageComposer, TypingIndicator } from "@krizaka/ui/chat";
import { ChoiceGrid } from "@krizaka/ui/choice-grid";
import { CodeBlock } from "@krizaka/ui/code-block";
import { Progress } from "@krizaka/ui/progress";
import { Stepper } from "@krizaka/ui/stepper";
import { TerminalReplay } from "@krizaka/ui/terminal-replay";
import { ChatIcon, ImageIcon, VideoIcon } from "@krizaka/icons";
import { useI18n } from "../../I18nProvider";
import { useStream } from "./shared";
import type { KitTileProps } from "./types";

const CALL = `curl -N -X POST "$ORAZAKA_URL/api/v1/chat/stream/support-weekly" \\
  -H "Authorization: Bearer $TOKEN"`;

export default function OrazakaTile({ id, terminal }: KitTileProps) {
  const { t } = useI18n();
  const k = t.site.home.build.kit;
  const cli = t.site.home.build.cli;
  const [draft, setDraft] = useState("");
  const [studio, setStudio] = useState("chat");
  const { shown, done, ref } = useStream(k.chat.answer);

  switch (id) {
    case "chat":
      return (
        <div className="kl-chat" ref={ref}>
          <MessageBubble mine text={k.chat.user} grouped="single" />
          <MessageBubble text={shown || "…"} grouped="single" />
          {!done && <TypingIndicator label={k.chat.typing} />}
          <MessageComposer value={draft} onValueChange={setDraft} onSend={() => setDraft("")} placeholder={k.chat.composer} sendLabel={k.chat.send} />
        </div>
      );
    case "code-block":
      return <CodeBlock code={CALL} language="bash" file={k.code.file} copyLabel={k.code.copy} copiedLabel={k.code.copied} highlight />;
    case "stepper":
      return (
        <Stepper
          aria-label={k.stepper.label}
          labels={k.stepper.labels}
          current={1}
          steps={[
            { title: k.stepper.queued, description: k.stepper.queuedHint },
            { title: k.stepper.running, description: k.stepper.runningHint, value: 0.58, content: <Progress label={k.stepper.running} value={58} eta={k.stepper.eta} showLabel size="sm" /> },
            { title: k.stepper.saved, description: k.stepper.savedHint },
          ]}
        />
      );
    case "choice-grid":
      return (
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
      );
    case "terminal-replay":
      return (
        <TerminalReplay
          steps={terminal}
          label={cli.label}
          title="~/projects — zsh"
          playLabel={cli.play}
          pauseLabel={cli.pause}
          replayLabel={cli.replay}
          copyLabel={cli.copy}
          copiedLabel={cli.copied}
          rows={9}
        />
      );
    default:
      return null;
  }
}
