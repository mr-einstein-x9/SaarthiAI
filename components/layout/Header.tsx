"use client";

import { Languages, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Language } from "@/lib/types";
import { t } from "@/lib/i18n";

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  compact?: boolean;
}

export default function Header({ lang, onToggleLang, compact = false }: HeaderProps) {
  const strings = t(lang);

  return (
    <header
      className={`flex flex-col items-center transition-all duration-700 ${
        compact ? "mt-4 gap-1" : "mt-[12vh] gap-2"
      }`}
    >
      {/* Logo */}
      <Image
        src="/saarthi-symbol.png"
        alt="SaarathiAI"
        width={112}
        height={112}
        priority
        className={`object-contain transition-all duration-700 ${
          compact ? "w-16 h-16" : "w-24 h-24 sm:w-28 sm:h-28"
        }`}
      />

      {/* Title */}
      <h1
        className={`font-bold transition-all duration-700 ${
          compact ? "text-xl" : "text-3xl sm:text-4xl"
        }`}
      >
        SaarathiAI{" "}
        <span className="font-spiritual text-[var(--accent-gold)]">
          {strings.subtitle}
        </span>
      </h1>

      {/* Tagline */}
      {!compact && (
        <p className="text-[var(--text-secondary)] text-sm mt-1 animate-fade-in">
          {strings.tagline}
        </p>
      )}

      {/* Nav buttons */}
      {compact && (
        <nav className="flex items-center gap-3 mt-2">
          <Link
            href="/browse"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-[var(--border)] bg-[var(--bg-glass)] backdrop-blur-sm text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
          >
            <BookOpen size={13} />
            {strings.browse}
          </Link>

          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-[var(--border)] bg-[var(--bg-glass)] backdrop-blur-sm text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
            aria-label={`Switch to ${lang === "en" ? "Hindi" : "English"}`}
          >
            <Languages size={13} />
            {lang === "en" ? "हिंदी" : "EN"}
          </button>
        </nav>
      )}
    </header>
  );
}
