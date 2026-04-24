// app/api/ask/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safe_generate } from "@/lib/gemini";
import fs from 'fs';
import path from 'path';

const normalize = (t: string) => t.toLowerCase().replace(/[^\w\s]/g, "");

export async function POST(request: Request) {
  const start = Date.now();
  try {
    const { problem, language = "en" } = await request.json();
    const query = problem;
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    // 1. Try EXTERNAL Backend
    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, language })
        });
        if (res.ok) return Response.json(await res.json());
      } catch (e) { console.warn("External backend unreachable."); }
    }

    // 2. INTERNAL Logic (Local DB)
    try {
      const geetaPath = path.join(process.cwd(), 'backend', 'geeta.json');
      if (fs.existsSync(geetaPath)) {
        const data = JSON.parse(fs.readFileSync(geetaPath, 'utf8'));
        const normQuery = normalize(query);
        const queryWords = normQuery.split(/\s+/).filter(w => w.length > 2);
        
        if (queryWords.length >= 1) {
          let bestVerse = null, maxScore = 0;
          for (const v of data) {
            const content = normalize(`${v.translation} ${v.meaning}`);
            const score = queryWords.reduce((acc, w) => acc + (content.includes(w) ? 1 : 0), 0);
            if (score > maxScore) { maxScore = score; bestVerse = v; }
          }
          if (bestVerse && maxScore >= Math.max(1, Math.floor(queryWords.length / 2))) {
            return Response.json({
              success: true, source: "database", latency_ms: Date.now() - start,
              data: {
                verse: {
                  chapter: bestVerse.chapter, verse: bestVerse.verse,
                  text: bestVerse.text, translation: bestVerse.translation, meaning: bestVerse.meaning
                },
                explanation: bestVerse.meaning,
                action: language === "hi" ? "इस श्लोक के दर्शन और कर्म के सिद्धांत पर विचार करें।" : "Reflect on the philosophy and principles of action in this verse.",
                relevance: language === "hi" ? `यह श्लोक आपके प्रश्न '${query}' का समाधान करता है।` : `This verse addresses your query about '${query}'.`
              }
            });
          }
        }
      }
    } catch (e) { console.warn("Internal DB search failed."); }

    // 3. INTERNAL Logic (Gemini)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are Saarathi (सारथी). Use ONLY ${ language === "hi" ? "HINDI" : "ENGLISH" } (except 'text' which is Sanskrit).
    STRUCTURE: { "verse": { "chapter", "verse", "text", "translation", "meaning" }, "explanation", "action", "relevance" }
    RULES: No hallucinations, keep explanation 3-5 lines, align strictly with user query.`;
    
    const result = await safe_generate(model, {
      contents: [{ role: "user", parts: [{ text: query }] }],
      systemInstruction: systemPrompt,
      generationConfig: { responseMimeType: "application/json" }
    });

    const guidance = JSON.parse(result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return Response.json({ success: true, source: "api", latency_ms: Date.now() - start, data: guidance });

  } catch (error) {
    return Response.json({ success: false, error: "System failure", message: String(error) }, { status: 500 });
  }
}
