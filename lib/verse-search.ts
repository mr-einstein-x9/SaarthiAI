import type { Verse, Language } from "./types";

// ── Stopwords ──────────────────────────────────────────────────────────────

const STOPWORDS_EN = new Set([
  "is", "am", "are", "the", "a", "an", "and", "or", "to", "in", "of", "for",
  "with", "my", "i", "me", "how", "what", "why", "when", "where", "about",
  "can", "cant", "cannot", "do", "does", "did", "but", "not", "no", "so",
  "very", "just", "really", "too", "much", "been", "being", "have", "has",
  "had", "will", "would", "should", "could", "at", "by", "from", "up",
  "on", "was", "were", "this", "that", "it", "its", "im", "ive", "dont",
]);

const STOPWORDS_HI = new Set([
  "है", "हूं", "हैं", "का", "की", "के", "में", "से", "को", "पर", "और",
  "या", "एक", "यह", "वह", "मैं", "मुझे", "मेरा", "मेरी", "मेरे",
  "कि", "जो", "तो", "भी", "नहीं", "कर", "हो", "था", "ने", "कोई",
]);

// ── Tokenize ───────────────────────────────────────────────────────────────

function tokenize(text: string, lang: Language): string[] {
  const normalized = text.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, "");
  const stopwords = lang === "hi" ? STOPWORDS_HI : STOPWORDS_EN;
  return normalized
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopwords.has(w));
}

// ── IDF Calculation ────────────────────────────────────────────────────────

function buildIDF(verses: Verse[], lang: Language): Map<string, number> {
  const docCount = verses.length;
  const docFreq = new Map<string, number>();

  for (const verse of verses) {
    const keywords = lang === "hi" ? verse.keywords_hi : verse.keywords_en;
    const meaning = lang === "hi" ? verse.meaning_hi : verse.meaning_en;
    const allWords = new Set([
      ...keywords.map((k) => k.toLowerCase()),
      ...tokenize(meaning, lang),
      ...tokenize(verse.theme, "en"),
    ]);
    allWords.forEach((word) => {
      docFreq.set(word, (docFreq.get(word) ?? 0) + 1);
    });
  }

  const idf = new Map<string, number>();
  docFreq.forEach((freq, word) => {
    idf.set(word, Math.log((docCount + 1) / (freq + 1)) + 1);
  });
  return idf;
}

// ── Search ─────────────────────────────────────────────────────────────────

let cachedIDF: { lang: Language; idf: Map<string, number> } | null = null;

export function searchVerses(
  query: string,
  verses: Verse[],
  lang: Language = "en",
  topK: number = 3
): { results: Verse[]; topScore: number } {
  // Build or reuse IDF
  if (!cachedIDF || cachedIDF.lang !== lang) {
    cachedIDF = { lang, idf: buildIDF(verses, lang) };
  }
  const idf = cachedIDF.idf;

  const queryTokens = tokenize(query, lang);
  if (queryTokens.length === 0) return { results: [], topScore: 0 };

  const scored: { verse: Verse; score: number }[] = [];

  for (const verse of verses) {
    const keywords = lang === "hi" ? verse.keywords_hi : verse.keywords_en;
    const meaning = lang === "hi" ? verse.meaning_hi : verse.meaning_en;

    // Build document tokens with weights
    const keywordSet = new Set(keywords.map((k) => k.toLowerCase()));
    const meaningTokens = new Set(tokenize(meaning, lang));
    const themeTokens = new Set(tokenize(verse.theme, "en"));

    let score = 0;
    for (const token of queryTokens) {
      const weight = idf.get(token) ?? 1;

      // Keywords get 3x weight (they're curated tags)
      if (keywordSet.has(token)) {
        score += weight * 3;
      }
      // Theme match gets 2x weight
      else if (themeTokens.has(token)) {
        score += weight * 2;
      }
      // Meaning match gets 1x weight
      else if (meaningTokens.has(token)) {
        score += weight;
      }
    }

    if (score > 0) {
      scored.push({ verse, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return {
    results: scored.slice(0, topK).map((s) => s.verse),
    topScore: scored[0]?.score ?? 0,
  };
}
