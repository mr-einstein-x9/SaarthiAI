import { NextResponse } from "next/server";
import type { Verse, Language, GuidanceData } from "@/lib/types";
import { searchVerses } from "@/lib/verse-search";
import { buildPrompt, generateGuidance, parseResponse } from "@/lib/gemini";
import { queryCache } from "@/lib/cache";
import versesRaw from "@/data/verses.json";

// ── Pre-process verses once ────────────────────────────────────────────────
const verses: Verse[] = versesRaw as Verse[];

// ── Simple rate limiter ────────────────────────────────────────────────────
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const start = Date.now();

  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Krishna asks for patience.",
          retry_after_seconds: 60,
        },
        { status: 429 }
      );
    }

    // Parse body
    const body = await request.json();
    const query: string = (body.query ?? body.problem ?? "").trim();
    const language: Language = body.language === "hi" ? "hi" : "en";

    // Validate
    if (!query) {
      return NextResponse.json(
        { success: false, error: "No query provided." },
        { status: 400 }
      );
    }

    if (query.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Query too long. Maximum 2000 characters." },
        { status: 400 }
      );
    }

    // Cache check
    const cacheKey = `${language}:${query}`;
    const cached = queryCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        source: "cache",
        latency_ms: Date.now() - start,
      });
    }

    // Verse search
    const { results, topScore } = searchVerses(query, verses, language);

    let verseRef: string | null = null;
    let verseText: string | null = null;
    let principle: string | undefined;

    if (results.length > 0 && topScore > 2) {
      const v = results[0];
      verseRef = `BG ${v.chapter}.${v.verse}`;
      verseText = v.sanskrit;

      const translation =
        language === "en" ? v.meaning_en : v.meaning_hi;
      principle = translation.includes(". ")
        ? translation.split(". ")[0] + "."
        : translation;
    }

    // Build and send to Gemini
    const prompt = buildPrompt(query, language, principle, verseRef ?? undefined);
    const rawText = await generateGuidance(prompt);
    const parsed = parseResponse(rawText);

    const data: GuidanceData = {
      verse_ref: verseRef ?? "श्रीमद्भगवद्गीता",
      verse: verseText ?? "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।",
      arjuna_question: parsed.arjuna_question,
      krishna_answer: parsed.krishna_answer,
      meaning: parsed.meaning,
      meaning_for_you: parsed.meaning_for_you,
      action: parsed.action,
    };

    const responsePayload = {
      success: true as const,
      data,
      source: "gemini" as const,
      latency_ms: Date.now() - start,
    };

    queryCache.set(cacheKey, responsePayload);
    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /ask] Error:", msg);
    return NextResponse.json(
      {
        success: false,
        error: "Spiritual connection interrupted. Please try again.",
      },
      { status: 500 }
    );
  }
}
