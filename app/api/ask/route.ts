// app/api/ask/route.ts
// Self-contained: calls Gemini directly — no Python backend needed.

import { GoogleGenAI } from "@google/genai";
import versesRaw from "../../../verses.json";

// ── Types ──────────────────────────────────────────────────────────────────
interface Verse {
  chapter: number;
  verse: number;
  text?: string;
  translation?: string;
  meaning?: string;
  translation_clean?: string;
  meaning_clean?: string;
}

// ── Text helpers ───────────────────────────────────────────────────────────
function normalizeText(text: string): string {
  if (!text) return "";
  return text.toLowerCase().replace(/[^\w\s]/g, "");
}

// ── Pre-process verses once ────────────────────────────────────────────────
const verses: Verse[] = (versesRaw as Verse[]).map((v) => ({
  ...v,
  translation_clean: normalizeText(v.translation ?? ""),
  meaning_clean: normalizeText(v.meaning ?? ""),
}));

// ── Verse search ───────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  "is","am","are","the","a","an","and","or","to","in","of","for",
  "with","my","i","me","how","what","why","when","where","about",
]);

function searchVerses(query: string, topK = 3): { results: Verse[]; topScore: number } {
  const normQuery = normalizeText(query);
  const queryWords = normQuery.split(/\s+/).filter((w) => w && !STOPWORDS.has(w));
  if (!queryWords.length) return { results: [], topScore: 0 };

  const scored = verses
    .map((v) => {
      const content = `${v.translation_clean ?? ""} ${v.meaning_clean ?? ""}`.split(/\s+/);
      const score = queryWords.filter((w) => content.includes(w)).length;
      return { v, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    results: scored.slice(0, topK).map((x) => x.v),
    topScore: scored[0]?.score ?? 0,
  };
}

// ── Prompt ─────────────────────────────────────────────────────────────────
const UNIFIED_PROMPT = `You are recreating a conversation between Arjuna and Krishna on the battlefield of Kurukshetra.

You are given:
- User problem
- Optional Bhagavad Gita principle

Follow this format strictly:

Arjuna:
Write what Arjuna would have asked Krishna related to the user's problem. Frame it as a genuine doubt or fear Arjuna expressed on the battlefield. 1-2 lines.

Krishna:
Write Krishna's direct answer to Arjuna. This must be a real Gita teaching, not generic advice. 2-3 lines.

Meaning:
Explain Krishna's answer in simple, grounded language. 2-3 lines.

How This Relates to You:
Connect it directly to the user's exact situation. Be specific about their problem. 2-3 lines.

Krishna's Guidance:
Speak directly to the user and tell them what to do next. Clear, firm, actionable. 1-2 lines.

Rules:
- Arjuna's question must feel like a real battlefield doubt, not a modern rephrasing of the user query.
- Krishna's answer must be a real Gita teaching (karma, detachment, duty, mind control, soul, etc.).
- Do NOT be generic. Be specific to the user's problem.
- Do NOT fabricate shloka numbers.
- No poetic exaggeration.
- ALWAYS use the exact English headers: "Arjuna:", "Krishna:", "Meaning:", "How This Relates to You:", "Krishna's Guidance:"
- Even if content is in Hindi, headers MUST remain in English.`;

// ── Simple in-memory cache ─────────────────────────────────────────────────
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

function cacheGet(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) { cache.delete(key); return null; }
  return entry.data;
}
function cachePut(key: string, data: unknown) {
  if (cache.size >= 500) cache.delete(cache.keys().next().value!);
  cache.set(key, { data, ts: Date.now() });
}

// ── Gemini client (lazy) ───────────────────────────────────────────────────
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  return ai;
}

// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const start = Date.now();
  try {
    const body = await request.json();
    const query: string = (body.problem ?? body.query ?? "").trim();
    const language: string = body.language ?? "en";

    if (!query) {
      return Response.json({ success: false, error: "No query provided." }, { status: 400 });
    }

    // Cache check
    const cacheKey = `${language}:${query}`;
    const cached = cacheGet(cacheKey);
    if (cached) {
      return Response.json({ ...(cached as object), latency_ms: Date.now() - start });
    }

    // Verse search
    const normWords = normalizeText(query).split(/\s+/);
    let verseRef: string | null = null;
    let verseText: string | null = null;
    let principleText = "";

    if (normWords.length >= 2) {
      const { results, topScore } = searchVerses(query);
      const reqScore = Math.max(1, Math.floor(normWords.filter((w) => !STOPWORDS.has(w)).length / 2));

      if (results.length && topScore >= reqScore + 1) {
        const v = results[0];
        verseRef = `BG ${v.chapter}.${v.verse}`;
        verseText = v.text ?? null;
        const translation = language === "en" ? (v.translation ?? "") : (v.meaning ?? "");
        const principle = translation.includes(". ")
          ? translation.split(". ")[0] + "."
          : translation;
        principleText = `\n\nPrinciple: ${principle}\nReference: ${verseRef}`;
      }
    }

    // Build prompt
    const langInstr = `\n\nCRITICAL: Write the response content in ${
      language === "hi" ? "HINDI" : "ENGLISH"
    }. However, you MUST keep the section headers EXACTLY in English as specified above. Do NOT translate the headers.`;

    const promptContent = `${UNIFIED_PROMPT}${langInstr}\n\nUser Query: ${query}${principleText}`;

    // Call Gemini
    const gemini = getAI();
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptContent,
    });

    const rawText = result.text ?? "";
    const cleanText = rawText.replace(/\*\*/g, "");

    // Parse structured output
    let arjunaQ = "", krishnaA = "", meaning = "", meaningForYou = "", action = "";

    if (cleanText.includes("Arjuna:") && cleanText.includes("Krishna:")) {
      const afterArjuna = cleanText.split("Arjuna:")[1];
      const [aq, afterKrishna] = afterArjuna.includes("Krishna:")
        ? afterArjuna.split("Krishna:")
        : [afterArjuna, ""];

      const [ka, afterMeaning] = afterKrishna.includes("Meaning:")
        ? afterKrishna.split("Meaning:")
        : [afterKrishna, ""];

      const [mn, afterRelates] = afterMeaning.includes("How This Relates to You:")
        ? afterMeaning.split("How This Relates to You:")
        : [afterMeaning, ""];

      const [mfy, act] = afterRelates.includes("Krishna's Guidance:")
        ? afterRelates.split("Krishna's Guidance:")
        : [afterRelates, ""];

      arjunaQ     = aq.trim();
      krishnaA    = ka.trim();
      meaning     = mn.trim();
      meaningForYou = mfy.trim();
      action      = act.trim();
    } else {
      // Fallback: paragraphs
      const paragraphs = cleanText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
      krishnaA    = paragraphs[0] ?? cleanText;
      meaning     = paragraphs[1] ?? "";
      meaningForYou = paragraphs[2] ?? "";
      action      = paragraphs.slice(3).join("\n") ?? "";
    }

    const data = {
      verse_ref: verseRef ?? "श्रीमद्भगवद्गीता",
      verse:     verseText ?? "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।",
      arjuna_question: arjunaQ,
      krishna_answer:  krishnaA,
      meaning,
      meaning_for_you: meaningForYou,
      action: action ? [action] : ["Reflect and act with clarity."],
    };

    const responsePayload = {
      success: true,
      data,
      source: "gemini_direct",
      latency_ms: Date.now() - start,
    };

    cachePut(cacheKey, responsePayload);
    return Response.json(responsePayload);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("API error:", msg);
    return Response.json(
      { success: false, error: "Spiritual connection interrupted. Please try again." },
      { status: 500 }
    );
  }
}
