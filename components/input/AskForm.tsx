"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";
import type { Language } from "@/lib/types";
import { t, getPlaceholder } from "@/lib/i18n";
import Button from "@/components/ui/Button";
import SuggestionChips from "./SuggestionChips";

interface AskFormProps {
  lang: Language;
  problem: string;
  onProblemChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

export default function AskForm({
  lang,
  problem,
  onProblemChange,
  onSubmit,
  loading,
  error,
}: AskFormProps) {
  const strings = t(lang);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-5">
      <h2 className="text-lg font-medium text-center text-[var(--text-primary)]">
        {strings.heading}
      </h2>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={problem}
          onChange={(e) => onProblemChange(e.target.value)}
          placeholder={getPlaceholder(lang)}
          maxLength={2000}
          className="
            w-full bg-[var(--bg-glass)] backdrop-blur-xl
            border border-[var(--border)]
            rounded-2xl p-5 text-base
            min-h-[140px] resize-none
            outline-none
            text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold-glow)]
            transition-all duration-200
          "
          aria-label={strings.heading}
        />
        {problem.length > 0 && (
          <span className="absolute bottom-3 right-4 text-[10px] text-[var(--text-muted)]">
            {problem.length}/2000
          </span>
        )}
      </div>

      {/* Suggestion chips */}
      <SuggestionChips chips={strings.chips} onSelect={onProblemChange} />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={!problem.trim()}
        icon={<Sparkles size={16} />}
        className="w-full h-12 text-base"
      >
        {strings.submit}
      </Button>

      {/* Error */}
      {error && (
        <p className="text-[var(--error)] text-center text-sm animate-fade-in" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
