import json
import time
import os
import string
import logging
from collections import OrderedDict

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv('../.env.local')  

# Rate limiting awareness: Currently not implemented. For production, consider using slowapi or a similar rate limiting middleware.
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

logger.info("Initializing SaarthiAI Engine (Short & Insightful Style)...")
start_time = time.time()

def normalize_text(text):
    if not text: return ""
    return text.lower().translate(str.maketrans('', '', string.punctuation))

verses_path = os.path.join(os.path.dirname(__file__), 'geeta.json')
try:
    with open(verses_path, 'r', encoding='utf-8') as f:
        verses_data = json.load(f)
    for verse in verses_data:
        verse["translation_clean"] = normalize_text(verse.get("translation", ""))
        verse["meaning_clean"] = normalize_text(verse.get("meaning", ""))
except FileNotFoundError:
    verses_data = []

api_key = os.environ.get("GEMINI_API_KEY", "dummy_key")
genai.configure(api_key=api_key)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# UNIFIED KRISHNA PROMPT — Dialogue Format
UNIFIED_PROMPT = """You are recreating a conversation between Arjuna and Krishna on the battlefield of Kurukshetra.

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
- Even if content is in Hindi, headers MUST remain in English."""

logger.info(f"Initialization complete in {time.time() - start_time:.2f}s")

class SimpleCache:
    def __init__(self, max_size=500, ttl_seconds=600):
        self.cache = OrderedDict()
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds
    def get(self, key):
        if key in self.cache:
            res, ts = self.cache[key]
            if time.time() - ts < self.ttl_seconds:
                self.cache.move_to_end(key)
                return res
            del self.cache[key]
        return None
    def put(self, key, val):
        if len(self.cache) >= self.max_size: self.cache.popitem(last=False)
        self.cache[key] = (val, time.time())

query_cache = SimpleCache()

app = FastAPI(title="SaarthiAI Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class GuidanceRequest(BaseModel):
    query: str
    language: str = "en"

class GuidanceResponse(BaseModel):
    success: bool = True
    data: dict
    source: str
    latency_ms: int

def search_verses(query, dataset, top_k=3):
    norm_query = normalize_text(query)
    stopwords = {"is", "am", "are", "the", "a", "an", "and", "or", "to", "in", "of", "for", "with", "my", "i", "me", "how", "what", "why", "when", "where", "about"}
    query_words = [w for w in norm_query.split() if w and w not in stopwords]
    if not query_words: return [], 0
    scored = []
    for v in dataset:
        content = f"{v.get('translation_clean','')} {v.get('meaning_clean','')}".split()
        score = sum(1 for w in query_words if w in content)
        if score > 0: scored.append({"v": v, "s": score})
    scored.sort(key=lambda x: x["s"], reverse=True)
    return [x["v"] for x in scored[:top_k]], (scored[0]["s"] if scored else 0)

@app.post("/ask", response_model=GuidanceResponse)
async def get_guidance(req: GuidanceRequest):
    start = time.time()
    cache_key = f"{req.language}:{req.query.strip()}"
    cached = query_cache.get(cache_key)
    if cached: return {**cached, "latency_ms": int((time.time()-start)*1000)}

    query = req.query.strip()
    norm_words = normalize_text(query).split()
    results, top_score = ([], 0)
    if len(norm_words) >= 2: results, top_score = search_verses(query, verses_data)
    
    req_score = max(1, len([w for w in norm_words if w not in {"is","the","a","in"}]) // 2)

    principle_text = ""
    verse_ref = None
    verse_text = None

    if results and top_score >= req_score + 1:
        v = results[0]
        verse_ref = f"BG {v.get('chapter')}.{v.get('verse')}"
        verse_text = v.get("text")
        
        # Compress context for Gemini
        translation = v.get('translation') if req.language == 'en' else v.get('meaning', '')
        principle = translation.split('. ')[0] + '.' if '. ' in translation else translation
        principle_text = f"\n\nPrinciple: {principle}\nReference: {verse_ref}"

    lang_instr = f"\n\nCRITICAL: Write the response content in { 'HINDI' if req.language == 'hi' else 'ENGLISH' }. However, you MUST keep the section headers EXACTLY in English as specified above. Do NOT translate the headers."
    prompt_content = f"{UNIFIED_PROMPT}{lang_instr}\n\nUser Query: {query}{principle_text}"

    try:
        response = gemini_model.generate_content(prompt_content)
        text_out = response.text
        
        logger.info(f"Raw Gemini output:\n{text_out[:500]}")
        
        clean_text = text_out.replace("**", "")
        
        arjuna_q, krishna_a, meaning, meaning_for_you, action = "", "", "", "", ""
        
        # Parse the structured dialogue output
        if "Arjuna:" in clean_text and "Krishna:" in clean_text:
            # Extract Arjuna's question
            after_arjuna = clean_text.split("Arjuna:", 1)[1]
            if "Krishna:" in after_arjuna:
                arjuna_q, after_krishna = after_arjuna.split("Krishna:", 1)
            else:
                arjuna_q, after_krishna = after_arjuna, ""
            
            # Extract Krishna's answer
            if "Meaning:" in after_krishna:
                krishna_a, after_meaning = after_krishna.split("Meaning:", 1)
            else:
                krishna_a, after_meaning = after_krishna, ""
            
            # Extract Meaning
            if "How This Relates to You:" in after_meaning:
                meaning, after_relates = after_meaning.split("How This Relates to You:", 1)
            else:
                meaning, after_relates = after_meaning, ""
            
            # Extract Relates to You and Guidance
            if "Krishna's Guidance:" in after_relates:
                meaning_for_you, action = after_relates.split("Krishna's Guidance:", 1)
            else:
                meaning_for_you, action = after_relates, ""
            
            arjuna_q = arjuna_q.strip()
            krishna_a = krishna_a.strip()
            meaning = meaning.strip()
            meaning_for_you = meaning_for_you.strip()
            action = action.strip()
        else:
            # Fallback: split by paragraphs
            paragraphs = [p.strip() for p in clean_text.split('\n\n') if p.strip()]
            if len(paragraphs) >= 3:
                krishna_a = paragraphs[0]
                meaning = paragraphs[1]
                meaning_for_you = paragraphs[2]
                action = "\n".join(paragraphs[3:]) if len(paragraphs) > 3 else ""
            else:
                krishna_a = clean_text
        
        # Backend mapping — dialogue format, verse always Sanskrit
        data = {
            "verse_ref": verse_ref if verse_ref else "\u0936\u094d\u0930\u0940\u092e\u0926\u094d\u092d\u0917\u0935\u0926\u094d\u0917\u0940\u0924\u093e",
            "verse": verse_text if verse_text else "\u092f\u094b\u0917\u0938\u094d\u0925\u0903 \u0915\u0941\u0930\u0941 \u0915\u0930\u094d\u092e\u093e\u0923\u093f \u0938\u0919\u094d\u0917\u0902 \u0924\u094d\u092f\u0915\u094d\u0924\u094d\u0935\u093e \u0927\u0928\u091e\u094d\u091c\u092f\u0964",
            "arjuna_question": arjuna_q,
            "krishna_answer": krishna_a,
            "meaning": meaning,
            "meaning_for_you": meaning_for_you,
            "action": [action] if action else ["Reflect and act with clarity."]
        }

        res = {"success": True, "data": data, "source": "unified_api", "latency_ms": 0}
        query_cache.put(cache_key, res)
        res["latency_ms"] = int((time.time()-start)*1000)
        return res
    except Exception as e:
        logger.error(f"Error generating guidance: {str(e)}")
        return JSONResponse(status_code=500, content={"success": False, "error": "Spiritual connection interrupted. Please try again."})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
