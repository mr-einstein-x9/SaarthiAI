import { GoogleGenAI } from "@google/genai";
import type { Language } from "./types";

// ── Prompt Template ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are recreating a conversation between Arjuna and Krishna on the battlefield of Kurukshetra.

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

// ── Client (lazy singleton) ────────────────────────────────────────────────

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// ── Build prompt ───────────────────────────────────────────────────────────

export function buildPrompt(
  query: string,
  language: Language,
  principle?: string,
  verseRef?: string
): string {
  const langInstr = `\n\nCRITICAL: Write the response content in ${
    language === "hi" ? "HINDI" : "ENGLISH"
  }. However, you MUST keep the section headers EXACTLY in English as specified above. Do NOT translate the headers.`;

  const principleText =
    principle && verseRef
      ? `\n\nPrinciple: ${principle}\nReference: ${verseRef}`
      : "";

  return `${SYSTEM_PROMPT}${langInstr}\n\nUser Query: ${query}${principleText}`;
}

// ── Parse response ─────────────────────────────────────────────────────────

export interface ParsedGuidance {
  arjuna_question: string;
  krishna_answer: string;
  meaning: string;
  meaning_for_you: string;
  action: string[];
}

export function parseResponse(rawText: string): ParsedGuidance {
  const clean = rawText.replace(/\*\*/g, "");

  let arjunaQ = "",
    krishnaA = "",
    meaning = "",
    meaningForYou = "",
    action = "";

  if (clean.includes("Arjuna:") && clean.includes("Krishna:")) {
    const afterArjuna = clean.split("Arjuna:")[1];
    const [aq, afterKrishna = ""] = afterArjuna.includes("Krishna:")
      ? afterArjuna.split("Krishna:")
      : [afterArjuna, ""];

    const [ka, afterMeaning = ""] = afterKrishna.includes("Meaning:")
      ? afterKrishna.split("Meaning:")
      : [afterKrishna, ""];

    const [mn, afterRelates = ""] = afterMeaning.includes(
      "How This Relates to You:"
    )
      ? afterMeaning.split("How This Relates to You:")
      : [afterMeaning, ""];

    const [mfy, act = ""] = afterRelates.includes("Krishna's Guidance:")
      ? afterRelates.split("Krishna's Guidance:")
      : [afterRelates, ""];

    arjunaQ = aq.trim();
    krishnaA = ka.trim();
    meaning = mn.trim();
    meaningForYou = mfy.trim();
    action = act.trim();
  } else {
    // Fallback: paragraph split
    const paragraphs = clean
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    krishnaA = paragraphs[0] ?? clean;
    meaning = paragraphs[1] ?? "";
    meaningForYou = paragraphs[2] ?? "";
    action = paragraphs.slice(3).join("\n") ?? "";
  }

  // Split action into list items if it contains bullet points or newlines
  const actionItems = action
    ? action
        .split(/\n/)
        .map((line) => line.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean)
    : ["Reflect and act with clarity."];

  return {
    arjuna_question: arjunaQ,
    krishna_answer: krishnaA,
    meaning,
    meaning_for_you: meaningForYou,
    action: actionItems,
  };
}

// ── Generate with retries ──────────────────────────────────────────────────

const MAX_RETRIES = 4;

export async function generateGuidance(prompt: string): Promise<string> {
  const client = getClient();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = result.text ?? "";
      if (!text.trim()) {
        throw new Error("Empty response from Gemini");
      }
      return text;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const msg = lastError.message;

      // Retry on rate limit or server errors
      if (msg.includes("503") || msg.includes("429") || msg.includes("quota")) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        console.warn(
          `[Gemini] Retryable error (attempt ${attempt + 1}/${MAX_RETRIES}). Waiting ${delay}ms...`
        );
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      // Non-retryable error
      throw lastError;
    }
  }

  throw lastError ?? new Error("Max retries exceeded.");
}
