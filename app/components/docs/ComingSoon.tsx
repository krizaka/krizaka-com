import { Clock } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";

/* A contract the services do not publish yet: say so, and link the issue that tracks it. */
export function ComingSoon({ issue, locale }: { issue: string; locale: Locale }) {
  const t = getDictionary(locale).docs.comingSoon;
  return (
    <aside className="kz-coming-soon not-prose" role="note">
      <Clock size={16} aria-hidden className="kz-coming-soon-icon" />
      <div>
        <p className="kz-coming-soon-title">{t.title}</p>
        <p>{t.body}</p>
        <a href={issue} target="_blank" rel="noreferrer">{t.issue} →</a>
      </div>
    </aside>
  );
}
