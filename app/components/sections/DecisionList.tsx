import { CheckIcon, CloseIcon, ForwardIcon, WarningIcon } from "@krizaka/icons";
import { reveal } from "@/lib/motion";
import Inline from "./Inline";

export interface Decision {
  chose: string;
  refused: string;
  because: string;
  cost: string;
}

/** Numbered decisions, each a card: what was chosen (large, first), then side by side what was refused, why, and what
    it costs the reader — each with its mark (✓ ✕ → !) and its colour, so the eye compares decisions at a glance. */
export default function DecisionList({ decisions, labels }: { decisions: readonly Decision[]; labels: { chose: string; refused: string; because: string; cost: string } }) {
  return (
    <ol className="ps-decisions">
      {decisions.map((d, i) => (
        <li key={d.chose} className="ps-decision" {...reveal(i, "soft")}>
          <span className="ps-decision-n" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="ps-decision-body">
            <div className="is-chose">
              <p className="ps-label">
                <CheckIcon size={13} aria-hidden /> {labels.chose}
              </p>
              <p>
                <Inline text={d.chose} />
              </p>
            </div>
            <div className="ps-decision-grid">
              <div className="is-refused">
                <p className="ps-label">
                  <CloseIcon size={13} aria-hidden /> {labels.refused}
                </p>
                <p>
                  <Inline text={d.refused} />
                </p>
              </div>
              <div className="is-because">
                <p className="ps-label">
                  <ForwardIcon size={13} aria-hidden /> {labels.because}
                </p>
                <p>
                  <Inline text={d.because} />
                </p>
              </div>
              <div className="is-cost">
                <p className="ps-label">
                  <WarningIcon size={13} aria-hidden /> {labels.cost}
                </p>
                <p>
                  <Inline text={d.cost} />
                </p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
