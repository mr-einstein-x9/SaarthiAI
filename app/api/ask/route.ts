// app/api/ask/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safe_generate } from "@/lib/gemini";
import fs from 'fs';
import path from 'path';

// Helper to normalize text
const normalize = (t: string) => t.toLowerCase().replace(/[^\w\s]/g, "");

export async function POST(request: Request) {
  const start = Date.now();
  try {
    const { problem, language = "en" } = await request.json();
    const query = problem;
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    // 1. Try EXTERNAL Backend first
    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, language })
        });
        if (res.ok) {
          const data = await res.json();
          console.log("SOURCE: EXTERNAL_BACKEND");
          return Response.json(data);
        }
      } catch (e) {
        console.warn("External backend unreachable, using internal logic.");
      }
    }

    // 2. INTERNAL Logic (Local DB Search)
    try {
      const geetaPath = path.join(process.cwd(), 'backend', 'geeta.json');
      if (fs.existsSync(geetaPath)) {
        const data = JSON.parse(fs.readFileSync(geetaPath, 'utf8'));
        const normQuery = normalize(query);
        const queryWords = normQuery.split(/\s+/).filter(w => w.length > 2);
        
        if (queryWords.length >= 1) {
          let bestVerse = null;
          let maxScore = 0;
          
          for (const v of data) {
            const content = normalize(`${v.translation} ${v.meaning}`);
            const score = queryWords.reduce((acc, w) => acc + (content.includes(w) ? 1 : 0), 0);
            if (score > maxScore) {
              maxScore = score;
              bestVerse = v;
            }
          }

          const reqScore = Math.max(1, Math.floor(queryWords.length / 2));
          if (bestVerse && maxScore >= reqScore) {
            console.log("SOURCE: INTERNAL_DATABASE");
            return Response.json({
              success: true,
              source: "database",
              latency_ms: Date.now() - start,
              data: {
                shloka_sanskrit: bestVerse.text,
                shloka_english: bestVerse.translation,
                chapter_verse: `Chapter ${bestVerse.chapter}, Verse ${bestVerse.verse}`,
                opening_line: "Krishna speaks to you through the Gita.",
                core_message: bestVerse.translation,
                krishna_guidance: bestVerse.meaning,
                how_it_applies: "This teaching resonates with your current struggle.",
                practical_steps: ["Reflect on this wisdom.", "Stay dutiful.", "Trust the process."],
                daily_practice: "Meditate on this verse today.",
                deeper_wisdom: "Truth is eternal.",
                reflection_question: "How can you apply this today?",
                their_problem: problem
              }
            });
          }
        }
      }
    } catch (e) {
      console.warn("Internal DB search failed:", e);
    }

    // 3. INTERNAL Logic (Gemini Fallback)
    console.log("SOURCE: INTERNAL_GEMINI");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are Saarathi (सारथी), Krishna's guide. Respond in valid JSON.
    CRITICAL: shloka_sanskrit MUST be in original Sanskrit Devanagari.
    JSON structure: {shloka_sanskrit, shloka_english, chapter_verse, opening_line, problem_reflection, core_message, krishna_guidance, how_it_applies, practical_steps:[], daily_practice, deeper_wisdom, reflection_question, their_problem}`;
    
    const langPrompt = language === "hi" ? "Respond in HINDI." : "Respond in ENGLISH.";

    const result = await safe_generate(model, {
      contents: [{ role: "user", parts: [{ text: query }] }],
      systemInstruction: systemPrompt + "\n" + langPrompt,
      generationConfig: { responseMimeType: "application/json" }
    });

    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const guidance = JSON.parse(responseText);

    return Response.json({
      success: true,
      source: "api",
      latency_ms: Date.now() - start,
      data: guidance
    });

  } catch (error) {
    console.error("❌ Fatal API Error:", error);
    return Response.json({ success: false, error: "System failure", message: String(error) }, { status: 500 });
  }
}
