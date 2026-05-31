"use client";

import { useState, useEffect } from "react";

export default function UtcClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="font-mono text-[10px] tracking-[0.2em] text-kz-technical-line tabular-nums"
      suppressHydrationWarning
    >
      UTC {time}
    </span>
  );
}
