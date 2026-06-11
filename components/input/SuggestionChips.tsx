"use client";

interface SuggestionChipsProps {
  chips: string[];
  onSelect: (chip: string) => void;
}

export default function SuggestionChips({ chips, onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={() => onSelect(chip)}
          className="
            px-4 py-2 rounded-full text-xs
            bg-[var(--bg-glass)] backdrop-blur-sm
            border border-[var(--border)]
            text-[var(--text-secondary)]
            hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]
            active:scale-[0.97]
            transition-all duration-200
            cursor-pointer
            min-h-[36px]
          "
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
