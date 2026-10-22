"use client";

/* The notebook's hidden page (Oussama, 2026-10-22): krizaka.com shows three products; ↑ ↑ ↓ ↓ ← → ← → B A opens the
   notebook whole — the four others come back, their crossed-out lines un-crossed by a pen stroke (focus.css), and a
   note says so, with a way back. The state is the address (`?carnet=complet`): a reload or a shared link keeps it, and
   « refermer » is a real link to the same page without it. On a phone, the hint's taps do the same (PencilHint). The
   code never listens while the visitor types in a field or holds a shortcut, and nothing here blocks anything. */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { KONAMI, carnetOpen, konamiStep, withCarnet } from "@/lib/focus";
import { useI18n } from "./I18nProvider";
import { setCarnet, syncCarnetAttribute, useCarnet } from "./useCarnet";
import "./focus.css";

/** Before the first paint: the address says the notebook is open, so the page never flashes the focus. */
export function CarnetScript() {
  const js = `try{if(new URLSearchParams(location.search).get("carnet")==="complet")document.documentElement.dataset.carnet="complet"}catch(e){}`;
  return <script>{js}</script>;
}

const FIELDS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const typing = (el: EventTarget | null) => el instanceof HTMLElement && (FIELDS.has(el.tagName) || el.isContentEditable);

export default function CarnetEgg() {
  const open = useCarnet();
  const pathname = usePathname();
  const { t } = useI18n();
  const progress = useRef(0);
  /** Opened on purpose (code, taps): a client navigation to another page carries it along. */
  const kept = useRef(false);

  useEffect(() => {
    kept.current = carnetOpen(window.location.search);
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      progress.current = konamiStep(progress.current, e.key);
      if (progress.current === KONAMI.length) {
        progress.current = 0;
        kept.current = true;
        setCarnet(true);
      }
    };
    const onPop = () => {
      kept.current = carnetOpen(window.location.search);
      syncCarnetAttribute();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useEffect(() => {
    // A Link to another page drops the query: put it back while the notebook is meant to stay open.
    if (kept.current && !carnetOpen(window.location.search)) setCarnet(true);
    else syncCarnetAttribute();
  }, [pathname]);

  if (!open) return null;
  const c = t.site.carnet;
  const close = () => {
    kept.current = false;
    setCarnet(false);
  };
  return (
    <aside className="kz-carnet-note" role="status" aria-label={c.region}>
      <p>{c.found}</p>
      <a
        href={withCarnet(`${pathname}${typeof window === "undefined" ? "" : window.location.search}`, false)}
        onClick={(e) => {
          e.preventDefault();
          close();
        }}
      >
        {c.close}
      </a>
    </aside>
  );
}
