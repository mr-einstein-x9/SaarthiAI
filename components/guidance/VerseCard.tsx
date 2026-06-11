interface VerseCardProps {
  verseRef: string;
  verse: string;
}

export default function VerseCard({ verseRef, verse }: VerseCardProps) {
  return (
    <div className="p-6 text-center bg-[var(--bg-elevated)]/30 border-b border-[var(--border)]">
      <span className="text-[10px] text-[var(--accent-gold)] font-bold tracking-[0.2em] uppercase">
        {verseRef}
      </span>
      <p className="mt-3 font-spiritual text-xl md:text-2xl text-[var(--accent-gold-light)] leading-relaxed">
        {verse}
      </p>
    </div>
  );
}
