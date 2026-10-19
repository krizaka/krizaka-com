/* The still mini-visuals of /open-source's two stack cards — decorative (`inert`, aria-hidden: the card's words say the
   same), from @krizaka/ui and from data:
   - Krizaka UI: one component (Progress) worn by every product's identity (`.brand-<id>`, lib/products.ts);
   - Krizaka Java: the dependency a service declares — the BOM, at the version Maven Central gives at build. */

import { ProductLogo } from "@krizaka/ui";
import { Progress } from "@krizaka/ui/progress";
import { PRODUCTS } from "@/lib/products";
import { mavenVersion } from "@/lib/registry-versions";

export function UiVisual({ label }: { label: string }) {
  return (
    <figure className="os-visual" inert aria-hidden>
      <ul className="os-visual-identities">
        {PRODUCTS.map((p, i) => (
          <li key={p.id} className={"brand-" + p.id}>
            <ProductLogo id={p.id} size={16} animated={false} />
            <Progress value={35 + ((i * 9) % 55)} label={p.name} size="sm" />
          </li>
        ))}
      </ul>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export function JavaVisual({ label }: { label: string }) {
  const bom = mavenVersion("krizaka-bom");
  return (
    <figure className="os-visual" inert aria-hidden>
      <pre className="os-visual-code">
        <code>
          {`<dependency>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-bom</artifactId>
  <version>${bom ?? "…"}</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>`}
        </code>
      </pre>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
