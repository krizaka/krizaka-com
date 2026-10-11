import { Children, type CSSProperties, type ReactNode } from "react";
import { reveal } from "@/lib/motion";
import PointerLight from "./PointerLight";

/** A responsive grid of cards (one column on a phone): each child rises once, staggered by column; the cards of a row
    share their height; the pointer carries a light over the card it is on (PointerLight). */
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
      <PointerLight />
    </div>
  );
}
