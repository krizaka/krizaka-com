/* Krizaka UI, shown: one small composition of published @krizaka/ui pieces — a Card with an Avatar, a Meter, a row of
   Chips, a Switch and a Button — drawn in the page's theme, as a still picture (Oussama, 2026-10-23: a real composition
   that makes you want the kit, never a row of button variants). The picture is `inert` and named for assistive
   technology (`role="img"`, `label`); the real figure line under it (weekly downloads, read at build) stays outside the
   picture, so it is read. Words arrive as props (messages site.home.stack.ui.showcase), said as a sample; colours are the
   components' own tokens, so both themes read. */

// The named functions, not the `Card` / `Chip` compounds: a Server Component reaches a client module through client
// references, which carry components, not the properties of an object or a function (a compound's member is undefined
// there, and the prerender fails with « Element type is invalid »).
import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { CardBody, CardRoot } from "@krizaka/ui/card";
import { Chip, ChipGroup } from "@krizaka/ui/chip";
import { Meter } from "@krizaka/ui/meter";
import { Switch } from "@krizaka/ui/switch";

export interface UiShowcaseWords {
  /** What the picture shows, for assistive technology. */
  label: string;
  /** The sample person on the card. */
  person: { name: string; role: string };
  /** The sample meter: its name and its value in words. */
  meter: { label: string; valueText: string };
  /** The row of chips: the choice's name and its options (the first one chosen). */
  teams: { label: string; items: string[] };
  /** The switch's name. */
  digest: string;
  /** The button's label. */
  invite: string;
  /** The real figure line under the picture (only where the facts are shown). */
  downloads?: string;
}

/* The sample meter's fill, 0–100: a picture of the component, never a product figure. */
const SAMPLE_METER_VALUE = 80;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function UiShowcase({ w }: { w: UiShowcaseWords }) {
  return (
    <figure className="kz-play kz-showcase">
      <CardRoot className="kz-showcase-card" radius="lg" role="img" aria-label={w.label} inert>
        <CardBody padding="sm" className="kz-showcase-body">
          <div className="kz-showcase-person">
            <Avatar size="sm" fallback={initials(w.person.name)} alt="" />
            <span className="kz-showcase-who">
              <span className="kz-showcase-name">{w.person.name}</span>
              <span className="kz-showcase-role">{w.person.role}</span>
            </span>
          </div>
          <Meter label={w.meter.label} value={SAMPLE_METER_VALUE} valueText={w.meter.valueText} size="sm" showLabel />
          {/* @ephemeral: a still picture of the kit — a sample choice inside an inert image, never an address */}
          <ChipGroup type="single" required size="sm" label={w.teams.label} defaultValue={w.teams.items[0]}>
            {w.teams.items.map((team) => (
              <Chip key={team} value={team}>
                {team}
              </Chip>
            ))}
          </ChipGroup>
          <div className="kz-showcase-switch">
            <span>{w.digest}</span>
            <Switch size="sm" label={w.digest} defaultChecked />
          </div>
          <Button variant="primary" size="sm" type="button" className="kz-showcase-button">
            {w.invite}
          </Button>
        </CardBody>
      </CardRoot>
      {w.downloads ? <figcaption className="kz-showcase-caption">{w.downloads}</figcaption> : null}
    </figure>
  );
}
