"use client";

import { Component, type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";
import { UI_EXAMPLES, type UiExampleKey } from "@/lib/ui-examples";
import { examplePropsOf } from "@/lib/ui-example-props";
import { MapAssets } from "./MapAssets";

/* A named example of the registry, loaded when it scrolls into view: the catalogue shows 150 of them and ships none of
   their code until a card is near the screen. The heavy ones (maps, charts, media, whole pages) wait a moment more, once
   the page has settled. Static first: until it is loaded the card shows its placeholder, and a failure leaves it there. */
class Guard extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function LazyExample({ exampleKey, heavy, placeholder }: { exampleKey: string; heavy: boolean; placeholder: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(false);
  const [Example, setExample] = useState<ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        // The heavy ones wait for the page to settle: the first screen is painted before anything expensive starts.
        timer = setTimeout(() => setWanted(true), heavy ? 700 : 0);
      },
      { rootMargin: heavy ? "0px" : "240px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [heavy]);

  useEffect(() => {
    if (!wanted) return;
    let alive = true;
    const load = UI_EXAMPLES[exampleKey as UiExampleKey];
    void load?.().then((module) => alive && setExample(() => module.default as ComponentType<Record<string, unknown>>));
    return () => {
      alive = false;
    };
  }, [wanted, exampleKey]);

  return (
    <div ref={host} className="kz-catalog-live">
      {Example ? (
        <Guard fallback={placeholder}>
          {exampleKey.startsWith("map/") ? <MapAssets /> : null}
          <Example {...examplePropsOf(exampleKey)} />
        </Guard>
      ) : (
        placeholder
      )}
    </div>
  );
}
