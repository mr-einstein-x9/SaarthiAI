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

    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/ask`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, language })
        });
        if (res.ok) return Response.json(await res.json());
      } catch (e) { console.warn("External backend unreachable."); }
    }

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
                verse_ref: `BG ${bestVerse.chapter}.${bestVerse.verse}`,
                verse: bestVerse.text,
                insight: bestVerse.translation,
                meaning_for_you: language === "hi" ? `आपका मार्ग इस सत्य को समझने में है।` : "Your path lies in understanding this truth.",
                action: language === "hi" ? ["इस शिक्षण को अपनी स्थिति पर लागू करें।", "आज सचेत रहें।"] : ["Apply this teaching to your situation.", "Stay mindful today."]
              }
            });
          }
        }
      }
    } catch (e) { console.warn("Internal DB search failed."); }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are Saarathi (सारथी), Krishna's voice. Short, Deep, Practical. 
    NO numbering. 10-15s read time.
    STRUCTURE: { "verse_ref", "verse", "insight", "meaning_for_you", "action":[] }
    TONE: Calm, Sharp, Thought-provoking. 
    LANGUAGE: Use ONLY ${ language === "hi" ? "HINDI" : "ENGLISH" }.`;
    
    const result = await safe_generate(model, {
      contents: [{ role: "user", parts: [{ text: query }] }],
      systemInstruction: systemPrompt,
      generationConfig: { responseMimeType: "application/json" }
    });

    const guidance = JSON.parse(result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return Response.json({ success: true, source: "api", latency_ms: Date.now() - start, data: guidance });

  } catch (error) {
    return Response.json({ success: false, error: "System failure" }, { status: 500 });
  }
}
