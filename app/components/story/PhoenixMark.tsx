import { useId } from "react";

/* The phoenix of the Krizaka landscape, on its own: a purple wing and a gold wing — the two rival
   flames of the arcade legend — around one bright core. A slow float, off under reduced motion. */
export default function PhoenixMark({ size = 120 }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true" className="phx-float">
      <defs>
        <linearGradient id={`phx-p-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id={`phx-g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id={`phx-c-${id}`}>
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M56 62 C40 40 22 36 8 40 C22 46 30 56 34 70 C40 64 48 62 56 62 Z" fill={`url(#phx-p-${id})`} />
      <path d="M64 62 C80 40 98 36 112 40 C98 46 90 56 86 70 C80 64 72 62 64 62 Z" fill={`url(#phx-g-${id})`} />
      <path d="M52 66 C46 82 40 94 30 104 C44 98 52 90 58 78 Z" fill={`url(#phx-p-${id})`} opacity=".7" />
      <path d="M68 66 C74 82 80 94 90 104 C76 98 68 90 62 78 Z" fill={`url(#phx-g-${id})`} opacity=".7" />
      <path d="M60 34 L68 60 L60 82 L52 60 Z" fill="#1f1530" stroke="#e9d5ff" strokeOpacity=".5" />
      <circle cx="60" cy="58" r="12" fill={`url(#phx-c-${id})`} className="phx-core" />
      <circle cx="60" cy="58" r="3.5" fill="#fff" />
      <path d="M60 34 L56 24 M60 34 L64 24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
