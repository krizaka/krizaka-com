import { reveal } from "@/lib/motion";

export interface Decision {
  chose: string;
  refused: string;
  because: string;
  cost: string;
}

/** Numbered decisions, each with what was chosen, what was refused, why, and what it costs the reader. */
export default function DecisionList({ decisions, labels }: { decisions: readonly Decision[]; labels: { chose: string; refused: string; because: string; cost: string } }) {
  return (
    <ol className="ps-decisions">
      {decisions.map((d, i) => (
        <li key={d.chose} className="ps-decision" {...reveal(i, "soft")}>
          <div className="is-chose">
            <p className="ps-label">{labels.chose}</p>
            <p>{d.chose}</p>
          </div>
          <div>
            <p className="ps-label">{labels.refused}</p>
            <p>{d.refused}</p>
          </div>
          <div>
            <p className="ps-label">{labels.because}</p>
            <p>{d.because}</p>
          </div>
          <div className="is-cost">
            <p className="ps-label">{labels.cost}</p>
            <p>{d.cost}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
