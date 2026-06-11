import type { Language } from "@/lib/types";
import { t } from "@/lib/i18n";

interface DialogueBlockProps {
  arjunaQuestion: string;
  krishnaAnswer: string;
  lang: Language;
}

export default function DialogueBlock({
  arjunaQuestion,
  krishnaAnswer,
  lang,
}: DialogueBlockProps) {
  const strings = t(lang);

  return (
    <section>
      <h3 className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] mb-4 font-bold">
        {strings.labels.battlefield}
      </h3>
      <div className="space-y-4">
        {arjunaQuestion && (
          <div className="flex gap-3">
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider mt-1 shrink-0 min-w-[52px]">
              Arjuna
            </span>
            <p className="text-[var(--text-primary)] leading-relaxed text-base italic opacity-90">
              {arjunaQuestion}
            </p>
          </div>
        )}
        {krishnaAnswer && (
          <div className="flex gap-3">
            <span className="text-[10px] text-[var(--accent-gold)] font-bold uppercase tracking-wider mt-1 shrink-0 min-w-[52px]">
              Krishna
            </span>
            <p className="text-[var(--text-primary)] leading-relaxed text-lg">
              {krishnaAnswer}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
