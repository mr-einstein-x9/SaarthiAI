"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Languages } from "lucide-react";
import type { Language } from "@/lib/types";
import { t } from "@/lib/i18n";
import { CHAPTERS } from "@/lib/types";
import Background from "@/components/layout/Background";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

// Helper for Hindi numerals
const toHindiNumerals = (num: number): string => {
  const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return num
    .toString()
    .split("")
    .map((digit) => hindiDigits[parseInt(digit)] || digit)
    .join("");
};

export default function BrowsePage() {
  const [lang, setLang] = useState<Language>("en");
  const strings = t(lang);

  useEffect(() => {
    const saved = localStorage.getItem("saarathi-lang");
    Promise.resolve().then(() => {
      if (saved === "en" || saved === "hi") {
        setLang(saved);
      }
    });
  }, []);

  const handleToggleLang = () => {
    const nextLang = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    localStorage.setItem("saarathi-lang", nextLang);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-[var(--accent-gold-glow)]">
      <Background dimmed={true} />

      <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 gap-8 mt-6">
        {/* Navigation / Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <Link href="/">
            <Button
              variant="ghost"
              icon={<ArrowLeft size={16} />}
              className="pl-3 pr-4 cursor-pointer"
            >
              {strings.askKrishna}
            </Button>
          </Link>

          <button
            onClick={handleToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-[var(--border)] bg-[var(--bg-glass)] backdrop-blur-sm text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
            aria-label={`Switch to ${lang === "en" ? "Hindi" : "English"}`}
          >
            <Languages size={13} />
            {lang === "en" ? "हिंदी" : "EN"}
          </button>
        </header>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--accent-gold)] mb-2">
            <BookOpen size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {strings.browseTitle}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-md mx-auto">
            {strings.browseSubtitle}
          </p>
        </div>

        {/* Grid of Chapters */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
          {CHAPTERS.map((chapter, index) => {
            const chapNum = lang === "hi" ? toHindiNumerals(chapter.number) : chapter.number;
            const title = lang === "hi" ? chapter.name_hi : chapter.name_en;
            const desc = lang === "hi" ? chapter.description_hi : chapter.description_en;
            const verseCountLabel = lang === "hi" 
              ? `${toHindiNumerals(chapter.verse_count)} श्लोक` 
              : `${chapter.verse_count} Verses`;

            return (
              <Link key={chapter.number} href={`/browse/${chapter.number}`} className="group cursor-pointer">
                <Card
                  variant="default"
                  className="p-5 h-full flex flex-col justify-between hover:border-[var(--accent-gold)] group-hover:bg-[var(--bg-elevated)]/50 transition-all duration-300 transform group-active:scale-[0.98]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] font-bold">
                        {lang === "hi" ? `अध्याय ${chapNum}` : `Chapter ${chapNum}`}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] font-medium">
                        {verseCountLabel}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold-light)] transition-colors duration-200">
                      {title}
                    </h2>
                    
                    <p className="text-xs text-[var(--accent-gold-light)]/80 font-spiritual tracking-wide">
                      {chapter.name_sanskrit}
                    </p>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-1 line-clamp-2">
                      {desc}
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <span className="text-xs text-[var(--accent-gold)] font-medium group-hover:translate-x-1 transition-transform duration-200">
                      {lang === "hi" ? "श्लोक देखें →" : "Explore Verses →"}
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </main>
      </div>

      <footer className="w-full max-w-md mx-auto text-center py-4 text-[10px] text-[var(--text-muted)] tracking-wide leading-relaxed">
        {strings.footer}
      </footer>
    </div>
  );
}
