"use client";

/* The demo of /products/yazakia: the loop played on a phone, made only of Krizaka UI components — Chat (streamed
   replies), the portrait with its progress (no score), the debrief in chips, the batch's wait (Loader, Skeleton), the
   SwipeDeck of PersonCards with "why you two", the MatchDialog and the seven days of the intro (Countdown).
   Replies are scripted and the people invented (the real agent runs on Orazaka); nothing is saved.
   Reduced motion: no typing, no streaming, no timer — each step shows at once and moves on a press.
   Keyboard: every control is a button, the deck answers ← →, the focus follows the step; the same steps are written in
   a list beside the phone. Words: messages → site.yazakia.demo.*. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "@krizaka/i18n";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Chip } from "@krizaka/ui/chip";
import { MessageBubble, MessageComposer, TypingIndicator } from "@krizaka/ui/chat";
import { Countdown } from "@krizaka/ui/countdown";
import { Loader } from "@krizaka/ui/loader";
import { MatchDialog } from "@krizaka/ui/match-dialog";
import { Progress } from "@krizaka/ui/progress";
import { Skeleton, SkeletonText } from "@krizaka/ui/skeleton";
import { StepProgress } from "@krizaka/ui/step-progress";
import { PersonCard, SwipeDeck } from "@krizaka/ui/swipe-deck";
import { VerifiedBadge } from "@krizaka/ui/verified-badge";
import { YAZAKIA_DEMO_PEOPLE, type YazakiaDemoPersonId } from "@/lib/yazakia-demo";
import { useI18n } from "../I18nProvider";
import { useTargetIn, usePrefersReducedMotion } from "../home/kit/shared";
import "./yazakia-demo.css";

type Phase = "talk" | "portrait" | "debrief" | "loading" | "deck" | "intro";
const STEPS = ["talk", "debrief", "batch", "intro"] as const;
const STEP_OF: Record<Phase, number> = { talk: 0, portrait: 0, debrief: 1, loading: 2, deck: 2, intro: 3 };
const SEVEN_DAYS = 7 * 24 * 3600 * 1000;
const WORD_MS = 45;
const WAIT_MS = 2400;

type Msg = { id: number; mine: boolean; text: string; context?: string };

export default function YazakiaDemo({ portraits }: { portraits: Record<YazakiaDemoPersonId, string> }) {
  const { t } = useI18n();
  const d = t.site.yazakia.demo;
  const reduced = usePrefersReducedMotion();

  const [phase, setPhase] = useState<Phase>("talk");
  const [run, setRun] = useState(0); // a new run (Play again) cancels every pending timer of the previous one
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const interacted = useRef(false);
  const [announce, setAnnounce] = useState("");

  // Talk
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(true); // the agent speaks first
  const [turn, setTurn] = useState(0);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const ids = useRef(0);

  // Debrief, batch, intro
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [deck, setDeck] = useState<YazakiaDemoPersonId[]>(YAZAKIA_DEMO_PEOPLE.map((p) => p.id));
  const [matched, setMatched] = useState<YazakiaDemoPersonId | null>(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [introMsgs, setIntroMsgs] = useState<Msg[]>([]);
  const [introDraft, setIntroDraft] = useState("");
  const target = useTargetIn(SEVEN_DAYS);

  const alive = useRef(0);
  useEffect(() => {
    const token = ++alive.current;
    return () => {
      if (alive.current === token) alive.current += 1;
    };
  }, [run]);
  const sleep = useCallback(
    (ms: number, token: number) =>
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(alive.current === token), ms);
      }),
    [],
  );

  /** The agent speaks: dots, then the words one by one (all at once under reduced motion). */
  const say = useCallback(
    async (text: string, token: number): Promise<boolean> => {
      const id = ++ids.current;
      if (reduced) {
        setMsgs((m) => [...m, { id, mine: false, text }]);
        setAnnounce(text);
        return true;
      }
      setTyping(true);
      if (!(await sleep(650, token))) return false;
      setTyping(false);
      const words = text.split(" ");
      for (let i = 1; i <= words.length; i += 1) {
        const shown = words.slice(0, i).join(" ");
        setMsgs((m) => (m.some((x) => x.id === id) ? m.map((x) => (x.id === id ? { ...x, text: shown } : x)) : [...m, { id, mine: false, text: shown }]));
        if (!(await sleep(WORD_MS, token))) return false;
      }
      setAnnounce(text);
      return true;
    },
    [reduced, sleep],
  );

  // The conversation starts when the phone is on screen.
  useEffect(() => {
    const el = phoneRef.current;
    if (!el || started) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setStarted(true), 0);
      return () => window.clearTimeout(id);
    }
    const io = new IntersectionObserver(([entry]) => entry?.isIntersecting && setStarted(true), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const token = alive.current;
    void say(d.talk.turns[0]!.ask, token).then((ok) => ok && setBusy(false));
  }, [started, run, say, d.talk.turns]);

  const answer = useCallback(
    async (label: string, reply: string, trait?: string) => {
      if (busy || ready) return;
      const token = alive.current;
      interacted.current = true;
      setBusy(true);
      setMsgs((m) => [...m, { id: ++ids.current, mine: true, text: label }]);
      if (trait) setTraits((x) => [...x, trait]);
      setDraft("");
      if (!(await say(reply, token))) return;
      const next = d.talk.turns[turn + 1];
      if (next) {
        setTurn(turn + 1);
        if (!(await say(next.ask, token))) return;
      } else {
        if (!(await say(d.talk.closing, token))) return;
        setReady(true);
      }
      setBusy(false);
    },
    [busy, ready, say, turn, d.talk],
  );

  /** Moves to a step and says so (the title takes the focus, a polite line is read). */
  const go = useCallback(
    (next: Phase) => {
      interacted.current = true;
      setPhase(next);
      const step = STEP_OF[next];
      setAnnounce(format(d.announce, { step: format(d.stepOf, { n: step + 1, total: STEPS.length }), title: d.steps[STEPS[step]!].title }));
    },
    [d],
  );

  // The wait of the batch: a few seconds, or a press under reduced motion.
  useEffect(() => {
    if (phase !== "loading" || reduced) return;
    const id = window.setTimeout(() => go("deck"), WAIT_MS);
    return () => window.clearTimeout(id);
  }, [phase, reduced, go]);

  // The step's title takes the focus once the reader has acted (never on arrival).
  useEffect(() => {
    if (interacted.current) screenRef.current?.querySelector<HTMLElement>("[data-yd-title]")?.focus({ preventScroll: true });
  }, [phase]);

  // The conversation scrolls down with its last line.
  const logRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [msgs, typing, introMsgs, phase, reduced]);

  const person = (id: YazakiaDemoPersonId) => d.deck.people[id];
  const matchedPerson = matched ? person(matched) : null;

  const restart = () => {
    interacted.current = false;
    setBusy(true);
    setAnnounce("");
    setRun((r) => r + 1);
    setPhase("talk");
    setMsgs([]);
    setTyping(false);
    setBusy(false);
    setTurn(0);
    setReady(false);
    setDraft("");
    setTraits([]);
    setAnswers(["", "", ""]);
    setDeck(YAZAKIA_DEMO_PEOPLE.map((p) => p.id));
    setMatched(null);
    setMatchOpen(false);
    setIntroMsgs([]);
    setIntroDraft("");
    setStarted(false);
  };

  const items = useMemo(() => YAZAKIA_DEMO_PEOPLE.filter((p) => deck.includes(p.id)), [deck]);
  const answered = answers.filter(Boolean).length;
  const step = STEP_OF[phase];

  const talk = (
    <>
      <div className="yd-log" ref={logRef} role="group" aria-label={d.agent}>
        {msgs.map((m) => (
          <MessageBubble key={m.id} mine={m.mine} text={m.text} grouped="single" />
        ))}
        {typing ? <TypingIndicator label={d.typing} /> : null}
      </div>
      {ready ? (
        <div className="yd-actions">
          <Button variant="primary" shape="cut" onClick={() => go("portrait")}>
            {d.talk.toPortrait}
          </Button>
        </div>
      ) : (
        <div className="yd-composer">
          <div className="yd-quick" role="group" aria-label={d.quickReplies}>
            {!busy
              ? d.talk.turns[turn]?.choices.map((c) => (
                  <Button key={c.label} size="sm" variant="outline" shape="pill" onClick={() => void answer(c.label, c.reply, c.trait)}>
                    {c.label}
                  </Button>
                ))
              : null}
          </div>
          <MessageComposer
            value={draft}
            onValueChange={setDraft}
            onSend={() => draft.trim() && void answer(draft.trim(), d.talk.free)}
            placeholder={d.composer}
            sendLabel={d.send}
          />
        </div>
      )}
    </>
  );

  const screens: Record<Phase, React.ReactNode> = {
    talk,
    portrait: (
      <div className="yd-pane">
        <h3 className="yd-title" data-yd-title tabIndex={-1}>
          {d.portrait.title}
        </h3>
        <p className="yd-lead">{d.portrait.lead}</p>
        <div className="yd-traits" role="group" aria-label={d.portrait.traitsLabel}>
          {traits.map((trait) => (
            <Chip key={trait} removable removeLabel={format(d.portrait.remove, { trait })} onRemove={() => setTraits((all) => all.filter((x) => x !== trait))}>
              {trait}
            </Chip>
          ))}
        </div>
        <Progress label={d.portrait.progressLabel} value={traits.length >= 3 ? 3 : traits.length} max={3} valueText={traits.length >= 3 ? d.portrait.progressText : `${traits.length} / 3`} showLabel={false} size="sm" />
        <p className="yd-note">{d.portrait.progressText}. {d.portrait.noScore}</p>
        <div className="yd-actions">
          <Button variant="primary" shape="cut" onClick={() => go("debrief")}>
            {d.portrait.next}
          </Button>
        </div>
      </div>
    ),
    debrief: (
      <div className="yd-pane">
        <h3 className="yd-title" data-yd-title tabIndex={-1}>
          {d.debrief.title}
        </h3>
        <p className="yd-lead">{d.debrief.lead}</p>
        {d.debrief.questions.map((q, i) => (
          <div key={q.label} className="yd-q">
            <p className="yd-qlabel">{q.label}</p>
            <Chip.Group type="single" required size="sm" label={q.label} value={answers[i]} onValueChange={(v) => v && setAnswers((a) => a.map((x, j) => (j === i ? v : x)))} className="yd-chips">
              {q.options.map((o) => (
                <Chip key={o} value={o}>
                  {o}
                </Chip>
              ))}
            </Chip.Group>
          </div>
        ))}
        <Progress label={format(d.debrief.progress, { n: answered })} value={answered} max={3} valueText={format(d.debrief.progress, { n: answered })} showLabel={false} size="sm" />
        <p className="yd-note" role="status">
          {answered === 3 ? d.debrief.reshaped : format(d.debrief.progress, { n: answered })}
        </p>
        <div className="yd-actions">
          <Button variant="primary" shape="cut" disabled={answered < 3} onClick={() => go("loading")}>
            {d.debrief.unlock}
          </Button>
        </div>
      </div>
    ),
    loading: (
      <div className="yd-pane" aria-busy={!reduced}>
        <h3 className="yd-title" data-yd-title tabIndex={-1}>
          {d.loading.region}
        </h3>
        <Loader variant="block" label={d.loading.label} delay={0} minDuration={0} endDuration={0} />
        <div className="yd-skeleton" aria-hidden>
          <Skeleton shape="rect" className="yd-skeleton-card" />
          <SkeletonText lines={2} />
        </div>
        {reduced ? (
          <div className="yd-actions">
            <Button variant="primary" shape="cut" onClick={() => go("deck")}>
              {d.loading.show}
            </Button>
          </div>
        ) : null}
      </div>
    ),
    deck: (
      <div className="yd-pane yd-deckpane">
        <h3 className="yd-title yd-title-sm" data-yd-title tabIndex={-1}>
          {d.deck.title} <span className="yd-lead-inline">{d.deck.lead}</span>
        </h3>
        {items.length > 0 ? (
          <SwipeDeck
            items={items}
            getId={(p) => p.id}
            getName={(p) => person(p.id).name}
            onSwipe={(p, direction) => {
              interacted.current = true;
              setDeck((all) => all.filter((x) => x !== p.id));
              if (direction === "like" && !matched) {
                setMatched(p.id);
                setMatchOpen(true);
              }
            }}
            labels={{ ...d.deck.labels, decided: (name, direction) => format(d.deck.decided, { name, decision: direction === "like" ? d.deck.liked : d.deck.passed }) }}
            renderCard={(p) => {
              const who = person(p.id);
              return (
                <PersonCard
                  photos={[{ src: portraits[p.id] }]}
                  name={who.name}
                  age={p.age}
                  badge={<VerifiedBadge label={d.deck.verified} onMedia size="lg" />}
                  meta={
                    <p className="yd-why">
                      <b>{d.deck.why}.</b> {who.why}
                    </p>
                  }
                  footer={[...who.tags, format(d.deck.away, { km: p.km })].map((tag) => (
                    <Badge key={tag} tone="scrim">
                      {tag}
                    </Badge>
                  ))}
                />
              );
            }}
          />
        ) : (
          <div className="yd-empty">
            <h4 className="yd-title yd-title-sm">{d.deck.empty.title}</h4>
            <p className="yd-lead">{d.deck.empty.body}</p>
            {matched && matchedPerson ? (
              <Button variant="primary" shape="cut" onClick={() => go("intro")}>
                {format(d.deck.empty.intro, { name: matchedPerson.name })}
              </Button>
            ) : (
              <Button variant="primary" shape="cut" onClick={() => setDeck(YAZAKIA_DEMO_PEOPLE.map((p) => p.id))}>
                {d.deck.empty.again}
              </Button>
            )}
          </div>
        )}
      </div>
    ),
    intro: (
      <div className="yd-pane yd-intro">
        <h3 className="yd-title" data-yd-title tabIndex={-1}>
          {matchedPerson ? format(d.intro.title, { name: matchedPerson.name }) : d.intro.lead}
        </h3>
        <p className="yd-lead">{d.intro.lead}</p>
        {target ? <Countdown target={target} units={d.intro.units} label={d.intro.countdown} showLabel size="md" /> : null}
        <div className="yd-log" ref={logRef} role="group" aria-label={d.intro.title.replace("{name}", matchedPerson?.name ?? "")}>
          {matchedPerson ? <MessageBubble text={matchedPerson.whisper} context={d.intro.whisperLabel} grouped="single" /> : null}
          {introMsgs.map((m, i) => (
            <MessageBubble key={m.id} mine text={m.text} grouped="single" showStatus={i === introMsgs.length - 1} status="sent" labels={{ status: { sent: d.intro.sent } }} />
          ))}
        </div>
        <p className="yd-note">{d.intro.rule}</p>
        <MessageComposer
          value={introDraft}
          onValueChange={setIntroDraft}
          onSend={() => {
            if (!introDraft.trim()) return;
            setIntroMsgs((m) => [...m, { id: ++ids.current, mine: true, text: introDraft.trim() }]);
            setIntroDraft("");
          }}
          placeholder={format(d.intro.composer, { name: matchedPerson?.name ?? "" })}
          sendLabel={d.send}
        />
        <p className="yd-note">{d.intro.keep}</p>
      </div>
    ),
  };

  return (
    <div className="yd">
      <figure className="yd-phone-wrap">
        <div className="yd-phone" ref={phoneRef} role="group" aria-label={d.phoneLabel}>
          <div className="yd-notch" aria-hidden />
          <div className="yd-screen">
            <StepProgress step={step + 1} total={STEPS.length} label={(n, total) => format(d.stepOf, { n, total })} className="yd-steps" />
            <div className="yd-body" ref={screenRef}>
              {screens[phase]}
            </div>
          </div>
        </div>
        <figcaption>{d.note}</figcaption>
      </figure>

      <div className="yd-text">
        <h3 className="yd-h">{d.stepsLabel}</h3>
        <p className="yd-lead">{d.stepsLead}</p>
        <ol className="yd-list" aria-label={d.stepsLabel}>
          {STEPS.map((id, i) => (
            <li key={id} aria-current={i === step ? "step" : undefined} data-state={i < step ? "done" : i === step ? "now" : "next"}>
              <span className="yd-list-head">
                <strong>{d.steps[id].title}</strong>
                {i < step ? <Badge tone="neutral">{d.done}</Badge> : i === step ? <Badge tone="accent">{d.now}</Badge> : null}
              </span>
              <span>{d.steps[id].text}</span>
            </li>
          ))}
        </ol>
        <Button variant="secondary" shape="cut" onClick={restart}>
          {d.restart}
        </Button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      {matchedPerson && matched ? (
        <MatchDialog
          open={matchOpen}
          onOpenChange={setMatchOpen}
          title={d.match.title}
          description={format(d.match.description, { name: matchedPerson.name })}
          people={[{ src: null, name: d.match.me }, { src: portraits[matched], name: matchedPerson.name }]}
          primaryLabel={d.match.primary}
          onPrimary={() => {
            setMatchOpen(false);
            go("intro");
          }}
          secondaryLabel={d.match.secondary}
        />
      ) : null}
    </div>
  );
}
