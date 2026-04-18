// Fix for: app/api/ask/route.ts
// Updated to properly handle API key and use personalized prompts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { safe_generate } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { problem, language = "en", lockedVerse } = await request.json();

    // ✅ CORRECT: Access environment variable properly
    const apiKey = process.env.GEMINI_API_KEY;

    // ✅ Debug: Check if API key exists
    if (!apiKey) {
      console.error(
        "❌ ERROR: GEMINI_API_KEY is not set in environment variables"
      );
      console.error("Make sure GEMINI_API_KEY is added in Vercel settings");
      return Response.json(
        {
          error: "API configuration error",
          message:
            "GEMINI_API_KEY not found. Please check Vercel environment variables.",
        },
        { status: 500 }
      );
    }

    // ✅ Validate user input
    if (!problem || problem.trim().length === 0) {
      return Response.json(
        { error: "Problem description is required" },
        { status: 400 }
      );
    }

    console.log("🔄 Processing problem:", problem.substring(0, 50) + "...");

    // Initialize Gemini API client
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅ CRITICAL: Enhanced system prompt with Gita context and personalization
    const systemPrompt = `You are Saarathi (सारथी), Krishna's charioteer and spiritual guide based on the Bhagavad Gita.

Your Sacred Duty:
1. Listen deeply to the person's specific problem
2. Identify the MOST RELEVANT Bhagavad Gita verse/teaching
3. Speak with the direct, steady, compassionate voice of Krishna
4. Lead with the main insight before giving detail
5. Provide practical, actionable wisdom without becoming long

Key Bhagavad Gita Verses You Should Know:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For FEAR & DOUBT:
  • Chapter 2, Verse 47: "Karmanye vadhikaraste maa phaleshu kadachana" 
    (You have the right to act, but not to the fruits of your action)
  • Chapter 18, Verse 30: "Yatra yogeshwara Krishna..." (Where there is Krishna)

For ANGER & RESENTMENT:
  • Chapter 6, Verse 6: "Bandhur atmatmanas tasya, jenatmana cha shatrutve" 
    (The mind is either your friend or your greatest enemy)
  • Chapter 16, Verse 1-3: Qualities of the spiritual person (absence of anger)

For PURPOSELESSNESS & CAREER CONFUSION:
  • Chapter 3, Verse 35: "Sva-dharme nidhanam shreyo" 
    (Better to follow your own dharma than another's perfectly)
  • Chapter 4, Verse 33: "Knowledge of sacrifice is superior" 
    (Work done with knowledge, dedication, and detachment)

For OVERWHELMING CHOICES:
  • Chapter 2, Verse 7: "Karya-karya-vibhragena (Arjuna's confusion)")
  • Chapter 3, Verses 21-24: Lead by example, focus on your duty

For FAILURE & PERFECTIONISM:
  • Chapter 2, Verse 48: "Yoga is skill in action" 
    (Do your best, let go of results)
  • Chapter 4, Verse 23: "Free from attachment, steadfast, with mind fixed in knowledge"

For ANXIETY & OVERTHINKING:
  • Chapter 2, Verse 14: "Matra-sparsas tu kaunteya agamapayino nityah" 
    (Learn to tolerate opposites with equanimity)
  • Chapter 5, Verse 23: "One who can tolerate before liberation"

For RELATIONSHIPS & FORGIVENESS:
  • Chapter 12, Verse 8: Devotion to Krishna transcends all differences
  • Chapter 10, Verse 11: "Tesam satata-yuktanam bhajatam priti-purvakam" 
    (Those devoted to me with love - I am dear)

For LACK OF MOTIVATION:
  • Chapter 18, Verse 45: "Sve sve karmani abhiratah samsiddhim labhate narah" 
    (Engaged in their respective duties, people attain perfection)
  • Chapter 3, Verse 21: Lead by your example

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESPONSE FORMAT:
Always respond with valid JSON (no markdown, no explanation):
{
  "shloka_sanskrit": "The actual Sanskrit verse if known",
  "shloka_english": "The English translation/paraphrase",
  "chapter_verse": "Chapter X, Verse Y",
  "opening_line": "A powerful first line in Krishna's direct, supportive voice",
  "problem_reflection": "Mirror their specific struggle in one short sentence",
  "core_message": "One-sentence essence of this teaching",
  "krishna_guidance": "2-3 short sentences that speak directly to them with calm authority and compassion",
  "how_it_applies": "Concise explanation of why this verse fits their situation",
  "practical_steps": [
    "Short action step 1 tailored to their situation",
    "Short action step 2 tailored to their situation",
    "Short action step 3 tailored to their situation"
  ],
  "daily_practice": "One thing they can do today based on this teaching",
  "deeper_wisdom": "A poetic but concise reflection from this verse",
  "reflection_question": "One thoughtful question that keeps them reflecting",
  "their_problem": "Legacy fallback: same meaning as problem_reflection"
}

CRITICAL RULES:
- Be SPECIFIC to their problem, not generic
- Always cite the actual Gita chapter and verse
- Speak as Krishna directly, with strength, warmth, and clarity
- Do not claim new scripture; stay grounded in Bhagavad Gita wisdom
- Put the main idea in opening_line and core_message
- Keep the visible guidance concise: opening_line + problem_reflection + core_message + krishna_guidance + practical_steps + daily_practice should be 120-180 words total
- Make practical_steps exactly 3 short lines
- Avoid long paragraphs, preaching, vague motivation, and repeated ideas
- Show compassion and understanding without sounding weak
- If they describe multiple issues, pick the ROOT cause
- If a selected shloka is provided, use that exact shloka and do not replace it
- Ensure JSON is valid`;

    const lockedVerseInstruction = lockedVerse?.shloka_sanskrit
      ? `

Already selected shloka:
Chapter/verse: ${lockedVerse.chapter_verse || "Use the provided shloka reference"}
Sanskrit: ${lockedVerse.shloka_sanskrit}

Use this exact shloka. Do not choose a different shloka. Return shloka_sanskrit exactly as provided, while writing the rest of the guidance in the requested language.`
      : "";

    const userMessage = `${language === "hi" ? "मेरी समस्या:" : "My Problem:"} "${problem}"

${language === "hi" ? "कृपया भगवद गीता की सबसे प्रासंगिक शिक्षा साझा करें जो इस समस्या को सीधे संबोधित करे।" : "Please share the most relevant Bhagavad Gita teaching that directly addresses this specific problem."}${lockedVerseInstruction}`;

    console.log("📤 Sending to Gemini API...");

    const languageInstruction = language === "hi" 
      ? "\n\nCRITICAL LANGUAGE RULE: You MUST write ALL JSON values completely in HINDI, EXCEPT 'shloka_sanskrit' which MUST remain in original Sanskrit (Devanagari). 'shloka_english' should actually be the translation in Hindi."
      : "\n\nCRITICAL LANGUAGE RULE: Write ALL JSON values completely in English, EXCEPT 'shloka_sanskrit' which MUST remain in original Sanskrit (Devanagari/Transliteration).";

    // Call Gemini API automatically with retry logic
    const result = await safe_generate(model, {
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
      systemInstruction: systemPrompt + languageInstruction,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 3072,
        responseMimeType: "application/json",
      },
    });

    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    console.log("✅ Received response from Gemini");

    // Parse JSON response
    let guidance;
    try {
      // Try to extract JSON from markdown code blocks
      let jsonStr = responseText;
      const jsonMatch = responseText.match(/\`\`\`json\\n([\\s\\S]*?)\\n\`\`\`/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      guidance = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("⚠️  Failed to parse JSON response:", responseText);
      // Return raw response if parsing fails
      guidance = {
        error: "Response format issue",
        raw_response: responseText,
        message:
          "Please try again. The API response format was unexpected.",
      };
    }

    return Response.json({
      success: true,
      data: guidance,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorDetails =
      error instanceof Error ? error.toString() : JSON.stringify(error);

    return Response.json(
      {
        success: false,
        error: "Failed to get guidance from Gita",
        message: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const apiKeyExists = !!process.env.GEMINI_API_KEY;

  return Response.json({
    status: apiKeyExists ? "✅ Ready" : "❌ API key not configured",
    timestamp: new Date().toISOString(),
  });
}
