import { Children, type CSSProperties, type ReactNode } from "react";
import { reveal } from "@/lib/motion";

/** A responsive grid of cards (one column on a phone): each child rises once, staggered by column. */
export default function CardGrid({ children, columns = 2, min = 340 }: { children: ReactNode; columns?: number; min?: number }) {
  return (
    <div className="ps-grid" style={{ "--ps-min": `${min}px` } as CSSProperties}>
      {Children.toArray(children).map((child, i) => {
        const r = reveal(i % columns);
        return (
          <div key={i} className="ps-grid-cell" data-reveal={r["data-reveal"]} style={r.style}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
