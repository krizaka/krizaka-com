import { getRegistryItem } from "@/lib/ui-registry";
import { getDictionary, type Locale } from "@/lib/i18n";

/* The props of a primitive, generated from its types (react-docgen-typescript, in the @krizaka/ui registry): one table
   per exported component. Server Component. */
export async function PropsTable({ of, locale }: { of: string; locale: Locale }) {
  const item = await getRegistryItem(of);
  const t = getDictionary(locale).docs.props;
  const groups = item.props.filter((group) => group.props.length > 0);
  if (groups.length === 0) return <p className="kz-docs-note">{t.none}</p>;

  return (
    <div className="not-prose kz-props">
      {groups.map((group) => (
        <section key={group.component} className="kz-props-group">
          {groups.length > 1 && <h3 className="kz-props-component">{group.component}</h3>}
          {group.description && <p className="kz-props-description">{group.description}</p>}
          <div className="kz-table-scroll">
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
                    <td>{prop.description}</td>
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
