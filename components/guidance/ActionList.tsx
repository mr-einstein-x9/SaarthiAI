import type { Language } from "@/lib/types";
import { t } from "@/lib/i18n";

interface ActionListProps {
  actions: string[];
  lang: Language;
}

export default function ActionList({ actions, lang }: ActionListProps) {
  const strings = t(lang);

  return (
    <section>
      <h3 className="text-[10px] text-[var(--success)] uppercase tracking-[0.2em] mb-3 font-bold">
        {strings.labels.action}
      </h3>
      <ul className="space-y-2.5">
        {actions.map((action, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-[var(--text-primary)] text-sm animate-fade-in"
            style={{ animationDelay: `${(i + 1) * 100}ms` }}
          >
            <span className="text-[var(--success)] mt-0.5 shrink-0">✦</span>
            <span className="leading-relaxed">{action}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
