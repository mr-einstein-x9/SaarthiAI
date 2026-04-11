import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { findRelevantShlokas } from '@/lib/shlokas';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    krishna_teaching: {
      type: SchemaType.STRING,
      description: "2-3 lines explaining what Krishna is truly saying in this shloka, in plain conversational language"
    },
    your_situation: {
      type: SchemaType.STRING,
      description: "3-4 lines that directly address this person's problem using their own words. Be specific, surgical, human. Not generic."
    },
    one_step: {
      type: SchemaType.STRING,
      description: "One single concrete action this person can take today based on this teaching. Practical, not philosophical."
    },
    closing: {
      type: SchemaType.STRING,
      description: "One warm closing line, like a friend would say."
    }
  },
  required: ["krishna_teaching", "your_situation", "one_step", "closing"]
};

export async function POST(req: NextRequest) {
  try {
    const { problem, language } = await req.json();

    if (!problem) {
      return NextResponse.json({ error: "Problem is required" }, { status: 400 });
    }

    const relevantShlokas = findRelevantShlokas(problem, language || 'en');
    const primaryShloka = relevantShlokas[0];
    const otherShlokas = relevantShlokas.slice(1);

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No API key, falling back to basic");
      return generateFallback(primaryShloka, otherShlokas, language, problem);
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const systemPrompt = `You are SaarathiAI (सारथी), a compassionate and wise guide who helps people find clarity through the timeless wisdom of the Bhagavad Gita.
You speak like a warm, understanding friend — never preachy, never vague, never generic. You are deeply empathetic.

STRICT RULES you must follow:
1. Your ENTIRE response must be grounded in the provided shloka only. Do not bring in teachings from other shlokas or other texts.
2. You MUST use the user's own words in your response. Mirror their situation back to them specifically.
3. Never give generic spiritual advice like "focus on your karma". Every line must feel written for THIS person's problem.
4. If user wrote in Hindi, respond fully in Hindi. If English, respond in English.
5. Keep total response under 220 words.
6. Never mention you are an AI. You are SaarathiAI — a guide.`;

    const userPrompt = `A person is facing this problem:
"${problem}"

The most relevant teaching from the Bhagavad Gita is:
Chapter ${primaryShloka.chapter}, Verse ${primaryShloka.verse}
Sanskrit: ${primaryShloka.sanskrit}
Meaning: ${language === 'hi' ? primaryShloka.meaning_hi : primaryShloka.meaning_en}

Now write your guidance for this person reflecting ONLY on this given shloka.`;

    // Retry mechanism for API Call
    let parsedGuidance = null;
    let attempts = 0;
    while (attempts < 3 && !parsedGuidance) {
      try {
        const result = await model.generateContent({
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\n---\n\n" + userPrompt }] }
          ]
        });
        
        const responseText = result.response.text();
        let jsonResponse;
        
        try {
          jsonResponse = JSON.parse(responseText);
        } catch (e) {
          console.warn(`[Attempt ${attempts + 1}] Invalid JSON received.`);
          throw new Error("Invalid JSON structure");
        }
        
        // 1. Strict JSON Validation
        if (!jsonResponse.krishna_teaching || !jsonResponse.your_situation || !jsonResponse.one_step || !jsonResponse.closing) {
          console.warn(`[Attempt ${attempts + 1}] Missing required structural JSON fields.`);
          throw new Error("Missing required fields");
        }

        // 4. Grounding Enforcement Post-Check
        const totalWords = Object.values(jsonResponse).join(" ").split(/\s+/).filter(Boolean).length;
        
        if (totalWords > 220) {
          console.warn(`[Attempt ${attempts + 1}] Response rejected: Exceeded 220 words (${totalWords}).`);
          throw new Error("Response too long");
        }

        if (totalWords < 15) {
          console.warn(`[Attempt ${attempts + 1}] Response rejected: Empty or too short (${totalWords} words).`);
          throw new Error("Response too short");
        }

        const lowerCaseRes = Object.values(jsonResponse).join(" ").toLowerCase();
        if (lowerCaseRes.includes("focus on your karma") || lowerCaseRes.includes("as an ai")) {
          console.warn(`[Attempt ${attempts + 1}] Response rejected: Triggered generic flag.`);
          throw new Error("Generic or AI-like response");
        }

        parsedGuidance = jsonResponse; // Success
      } catch (err: any) {
        attempts++;
        if (attempts < 3) {
          console.warn(`Retrying Gemini Call. (Attempt ${attempts} failed: ${err.message})`);
        } else {
          console.warn(`All 3 attempts to generate valid response failed. Triggering fallback.`);
        }
      }
    }

    if (!parsedGuidance) {
      console.warn("Fallback triggered: Serving structured meaning override.");
      return generateFallback(primaryShloka, otherShlokas, language, problem);
    }

    return NextResponse.json({
      primary: {
        chapter: primaryShloka.chapter,
        verse: primaryShloka.verse,
        sanskrit: primaryShloka.sanskrit,
        transliteration: primaryShloka.transliteration,
        meaning: language === 'hi' ? primaryShloka.meaning_hi : primaryShloka.meaning_en,
        guidance: parsedGuidance
      },
      also_relevant: otherShlokas.map(s => ({
        chapter: s.chapter,
        verse: s.verse,
        sanskrit: s.sanskrit,
        transliteration: s.transliteration,
        meaning: language === 'hi' ? s.meaning_hi : s.meaning_en
      }))
    });

  } catch (error) {
    console.error("Endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function generateFallback(primaryShloka: any, otherShlokas: any[], language: string, problem: string) {
  const isHi = language === 'hi';
  const meaning = isHi ? primaryShloka.meaning_hi : primaryShloka.meaning_en;
  
  return NextResponse.json({
    primary: {
      chapter: primaryShloka.chapter,
      verse: primaryShloka.verse,
      sanskrit: primaryShloka.sanskrit,
      transliteration: primaryShloka.transliteration,
      meaning: meaning,
      guidance: {
        krishna_teaching: isHi ? `श्री कृष्ण इस श्लोक में स्पष्ट कहते हैं: "${meaning}"` : `Krishna directly explains in this verse: "${meaning}"`,
        your_situation: isHi ? `आप जिस स्थिति का सामना कर रहे हैं, उसमें यह ज्ञान अत्यधिक आवश्यक है।` : `Regarding your current struggle, this ancient wisdom applies precisely and directly to your situation.`,
        one_step: isHi ? `आज इस श्लोक के वास्तविक अर्थ पर 5 मिनट विचार करें।` : `Take 5 minutes today to deeply reflect on the literal meaning of this verse.`,
        closing: isHi ? `सारथी आपके साथ है। धैर्य रखें।` : `Saarathi is with you. Stay strong.`
      }
    },
    also_relevant: otherShlokas.map(s => ({
      chapter: s.chapter,
      verse: s.verse,
      sanskrit: s.sanskrit,
      transliteration: s.transliteration,
      meaning: isHi ? s.meaning_hi : s.meaning_en
    }))
  });
}
