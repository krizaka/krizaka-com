import type { RegistryComponent } from "@/lib/ui-registry";
import { getDictionary, type Locale } from "@/lib/i18n";
import { InlineCode } from "./InlineCode";

/* The props of a component, generated from its types (react-docgen-typescript, in the @krizaka/ui registry): one table
   per exported component, web or React Native. Server Component. */
export function PropsTable({ groups: all, locale }: { groups: RegistryComponent[]; locale: Locale }) {
  const t = getDictionary(locale).docs.props;
  const groups = all.filter((group) => group.props.length > 0);
  if (groups.length === 0) return <p className="kz-docs-note">{t.none}</p>;

  return (
    <div className="not-prose kz-props">
      {groups.map((group) => (
        <section key={group.component} className="kz-props-group" aria-label={group.component}>
          {groups.length > 1 && <p className="kz-props-component">{group.component}</p>}
          {group.description && (
            <p className="kz-props-description">
              <InlineCode text={group.description} />
            </p>
          )}
          <div className="kz-table-scroll" tabIndex={0} role="region" aria-label={group.component}>
            <table className="kz-table">
              <thead>
                <tr>
                  <th scope="col">{t.prop}</th>
                  <th scope="col">{t.type}</th>
                  <th scope="col">{t.default}</th>
                  <th scope="col">{t.description}</th>
                </tr>
              </thead>
              <tbody>
                {group.props.map((prop) => (
                  <tr key={prop.name}>
                    <th scope="row">
                      <code>{prop.name}</code>
                      {prop.required && <span className="kz-required">{t.required}</span>}
                    </th>
                    <td><code className="kz-type">{prop.type}</code></td>
                    <td>{prop.default ? <code>{prop.default}</code> : "—"}</td>
                    <td>
                      <InlineCode text={prop.description} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
