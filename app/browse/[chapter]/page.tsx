"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Languages, Search, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { Language, Verse } from "@/lib/types";
import { t } from "@/lib/i18n";
import { CHAPTERS } from "@/lib/types";
import versesRaw from "@/data/verses.json";
import Background from "@/components/layout/Background";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const verses: Verse[] = versesRaw as Verse[];

// Helper for Hindi numerals
const toHindiNumerals = (num: number): string => {
  const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return num
    .toString()
    .split("")
    .map((digit) => hindiDigits[parseInt(digit)] || digit)
    .join("");
};

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lang, setLang] = useState<Language>("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedVerses, setExpandedVerses] = useState<Record<string, boolean>>({});
  const [selectedTheme, setSelectedTheme] = useState<string>("all");

  const strings = t(lang);
  const chapterNumber = Number(params.chapter);

  // Sync lang selection with localStorage
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

  const chapterInfo = CHAPTERS.find((c) => c.number === chapterNumber);

  if (!chapterInfo || isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 18) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[var(--accent-gold-glow)] text-center">
        <Background dimmed={true} />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          {lang === "hi" ? "अध्याय नहीं मिला" : "Chapter Not Found"}
        </h1>
        <Link href="/browse">
          <Button variant="primary">{strings.backToChapters}</Button>
        </Link>
      </div>
    );
  }

  // Filter verses for this chapter
  const chapterVerses = verses.filter((v) => v.chapter === chapterNumber);

  // Get unique themes in this chapter
  const themes = ["all", ...Array.from(new Set(chapterVerses.map((v) => v.theme)))];

  // Apply search query and theme filter
  const filteredVerses = chapterVerses.filter((v) => {
    const matchesTheme = selectedTheme === "all" || v.theme === selectedTheme;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesTheme;

    const verseRef = `${v.chapter}.${v.verse}`;
    const matchesRef = verseRef.includes(query) || v.verse.toString() === query;
    const matchesSanskrit = v.sanskrit.includes(query);
    const matchesMeaning = lang === "hi" 
      ? v.meaning_hi.toLowerCase().includes(query) 
      : v.meaning_en.toLowerCase().includes(query);
    const matchesKeywords = lang === "hi"
      ? v.keywords_hi.some(k => k.toLowerCase().includes(query))
      : v.keywords_en.some(k => k.toLowerCase().includes(query));

    return matchesTheme && (matchesRef || matchesSanskrit || matchesMeaning || matchesKeywords);
  });

  const toggleExpand = (id: string) => {
    setExpandedVerses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAskKrishna = (verse: Verse) => {
    // Navigate to homepage with prefilled query
    const ref = `BG ${verse.chapter}.${verse.verse}`;
    const url = `/?query=${encodeURIComponent(ref)}`;
    router.push(url);
  };

  const chapNumLabel = lang === "hi" ? toHindiNumerals(chapterInfo.number) : chapterInfo.number;
  const chapterTitle = lang === "hi" ? chapterInfo.name_hi : chapterInfo.name_en;
  const chapterDesc = lang === "hi" ? chapterInfo.description_hi : chapterInfo.description_en;

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-[var(--accent-gold-glow)]">
      <Background dimmed={true} />

      <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 gap-8 mt-6">
        {/* Navigation / Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <Link href="/browse">
            <Button
              variant="ghost"
              icon={<ArrowLeft size={16} />}
              className="pl-3 pr-4 cursor-pointer"
            >
              {strings.backToChapters}
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

        {/* Chapter Summary Card */}
        <Card variant="elevated" className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--accent-gold)] uppercase tracking-[0.2em] font-bold">
              {lang === "hi" ? `अध्याय ${chapNumLabel}` : `Chapter ${chapNumLabel}`}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {lang === "hi" 
                ? `${toHindiNumerals(chapterVerses.length)} श्लोक (चुनिंदा)` 
                : `${chapterVerses.length} Verses (Curated)`}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {chapterTitle}
            </h1>
            <p className="text-sm text-[var(--accent-gold-light)] font-spiritual tracking-wide">
              {chapterInfo.name_sanskrit}
            </p>
          </div>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed pt-2">
            {chapterDesc}
          </p>
        </Card>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <input
              type="text"
              placeholder={lang === "hi" ? "श्लोक नंबर या शब्द खोजें..." : "Search verse number or text..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full bg-[var(--bg-glass)] backdrop-blur-md
                border border-[var(--border)] rounded-full
                pl-10 pr-4 py-2 text-sm text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)]
                outline-none focus:border-[var(--accent-gold)]
                transition-all duration-200 min-h-[40px]
              "
            />
          </div>

          {/* Theme selector pills */}
          {themes.length > 2 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-200 border
                    ${
                      selectedTheme === theme
                        ? "bg-[var(--accent-gold)] text-[#0A0A0A] border-[var(--accent-gold)] font-semibold"
                        : "bg-[var(--bg-glass)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent-gold)]"
                    }
                  `}
                >
                  {theme === "all" ? (lang === "hi" ? "सभी विषय" : "All Themes") : theme}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Verses List */}
        <main className="space-y-4 pb-12">
          {filteredVerses.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)] bg-[var(--bg-glass)] rounded-3xl border border-[var(--border)]">
              {lang === "hi" ? "कोई श्लोक नहीं मिला।" : "No verses match your filters."}
            </div>
          ) : (
            filteredVerses.map((verse) => {
              const isExpanded = !!expandedVerses[verse.id];
              const verseNumLabel = lang === "hi" 
                ? `श्लोक ${toHindiNumerals(verse.chapter)}.${toHindiNumerals(verse.verse)}` 
                : `BG ${verse.chapter}.${verse.verse}`;

              return (
                <Card
                  key={verse.id}
                  variant="verse"
                  className="transition-all duration-300 border border-[var(--border)] hover:border-[var(--accent-gold)]/40"
                >
                  {/* Collapsed Header */}
                  <div
                    onClick={() => toggleExpand(verse.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--accent-gold)] font-bold tracking-wider">
                          {verseNumLabel}
                        </span>
                        <span className="text-[10px] bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
                          {verse.theme}
                        </span>
                      </div>
                      <p className="font-spiritual text-base text-[var(--accent-gold-light)] leading-relaxed truncate">
                        {verse.sanskrit.split("\n")[0]}
                      </p>
                    </div>

                    <button
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0"
                      aria-label={isExpanded ? "Collapse verse details" : "Expand verse details"}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-[var(--border)] pt-4 space-y-5 animate-fade-in">
                      {/* Sanskrit */}
                      <div className="text-center bg-[var(--bg-elevated)]/20 p-4 rounded-2xl border border-[var(--border)]">
                        <p className="font-spiritual text-lg md:text-xl text-[var(--accent-gold-light)] leading-loose whitespace-pre-line">
                          {verse.sanskrit}
                        </p>
                        <p className="mt-3 text-xs text-[var(--text-secondary)]/85 italic leading-relaxed whitespace-pre-line font-serif">
                          {verse.transliteration}
                        </p>
                      </div>

                      {/* Translations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 bg-[var(--bg-elevated)]/40 p-4 rounded-2xl border border-[var(--border)]">
                          <span className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] font-bold">
                            English Translation
                          </span>
                          <p className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed pt-1">
                            {verse.meaning_en}
                          </p>
                        </div>

                        <div className="space-y-1 bg-[var(--bg-elevated)]/40 p-4 rounded-2xl border border-[var(--border)]">
                          <span className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] font-bold font-spiritual">
                            हिन्दी अनुवाद
                          </span>
                          <p className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed pt-1 font-spiritual">
                            {verse.meaning_hi}
                          </p>
                        </div>
                      </div>

                      {/* Keywords & Action */}
                      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pt-2">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                            Keywords:
                          </span>
                          {(lang === "hi" ? verse.keywords_hi : verse.keywords_en).map((keyword, i) => (
                            <span
                              key={i}
                              className="text-[10px] border border-[var(--border)] bg-[var(--bg-elevated)]/30 text-[var(--text-secondary)] px-2 py-0.5 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>

                        <Button
                          variant="primary"
                          onClick={() => handleAskKrishna(verse)}
                          icon={<Sparkles size={13} />}
                          className="h-9 px-4 text-xs font-semibold shrink-0 cursor-pointer"
                        >
                          {lang === "hi" ? "कृष्ण से मार्गदर्शन लें" : "Ask Krishna for Guidance"}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </main>
      </div>

      <footer className="w-full max-w-md mx-auto text-center py-4 text-[10px] text-[var(--text-muted)] tracking-wide leading-relaxed">
        {strings.footer}
      </footer>
    </div>
  );
}
