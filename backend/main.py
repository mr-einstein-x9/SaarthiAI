import json
import time
import os
import requests
import string
from collections import OrderedDict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables
load_dotenv('../.env.local')  

# --- SYSTEM INITIALIZATION ---
print("Initializing SaarthiAI Engine (Production Ready)...")
start_time = time.time()

def normalize_text(text):
    if not text: return ""
    return text.lower().translate(str.maketrans('', '', string.punctuation))

# 1. Load Data
verses_path = os.path.join(os.path.dirname(__file__), 'geeta.json')
try:
    with open(verses_path, 'r', encoding='utf-8') as f:
        verses_data = json.load(f)
    for verse in verses_data:
        verse["translation_clean"] = normalize_text(verse.get("translation", ""))
        verse["meaning_clean"] = normalize_text(verse.get("meaning", ""))
except FileNotFoundError:
    print("[WARN] geeta.json not found!")
    verses_data = []

# 2. Setup Gemini
api_key = os.environ.get("GEMINI_API_KEY", "dummy_key")
genai.configure(api_key=api_key)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# Detailed System Prompt from Frontend
SYSTEM_PROMPT = """You are Saarathi (सारथी), Krishna's charioteer and spiritual guide based on the Bhagavad Gita.
Your Sacred Duty:
1. Listen deeply to the person's specific problem
2. Identify the MOST RELEVANT Bhagavad Gita verse/teaching
3. Speak with the direct, steady, compassionate voice of Krishna
4. Lead with the main insight before giving detail
5. Provide practical, actionable wisdom without becoming long

CRITICAL RULE: The field 'shloka_sanskrit' MUST ALWAYS be the original Sanskrit verse (in Devanagari script). Do NOT translate this field.

RESPONSE FORMAT:
Always respond with valid JSON (no markdown, no explanation):
{
  "shloka_sanskrit": "The original Sanskrit verse in Devanagari",
  "shloka_english": "The English translation/paraphrase",
  "chapter_verse": "Chapter X, Verse Y",
  "opening_line": "A powerful first line in Krishna's direct, supportive voice",
  "problem_reflection": "Mirror their specific struggle in one short sentence",
  "core_message": "One-sentence essence of this teaching",
  "krishna_guidance": "2-3 short sentences that speak directly to them with calm authority and compassion",
  "how_it_applies": "Concise explanation of why this verse fits their situation",
  "practical_steps": ["step 1", "step 2", "step 3"],
  "daily_practice": "One thing they can do today",
  "deeper_wisdom": "A poetic reflection",
  "reflection_question": "One thoughtful question",
  "their_problem": "Legacy fallback"
}"""

print(f"Initialization complete in {time.time() - start_time:.2f}s")

# --- CACHE ---
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

# --- APP ---
app = FastAPI(title="SaarthiAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GuidanceRequest(BaseModel):
    query: str
    language: str = "en"

class GuidanceResponse(BaseModel):
    success: bool = True
    data: dict
    source: str
    latency_ms: int

# --- SEARCH ---
def search_verses(query, dataset, top_k=3):
    norm_query = normalize_text(query)
    stopwords = {"is", "am", "are", "the", "a", "an", "and", "or", "to", "in", "of", "for", "with", "my", "i", "me", "how", "what", "why", "when", "where", "about"}
    query_words = [w for w in norm_query.split() if w and w not in stopwords]
    if not query_words: return [], 0
    scored = []
    for v in dataset:
        score = sum(1 for w in query_words if w in f"{v.get('translation_clean','')} {v.get('meaning_clean','')}".split())
        if score > 0: scored.append({"v": v, "s": score})
    scored.sort(key=lambda x: x["s"], reverse=True)
    return [x["v"] for x in scored[:top_k]], (scored[0]["s"] if scored else 0)

@app.post("/ask", response_model=GuidanceResponse)
async def get_guidance(req: GuidanceRequest):
    start = time.time()
    cache_key = f"{req.language}:{req.query.strip()}"
    cached = query_cache.get(cache_key)
    if cached:
        print("SOURCE: CACHE")
        return {**cached, "latency_ms": int((time.time()-start)*1000)}

    query = req.query.strip()
    norm_words = normalize_text(query).split()
    results, top_score = ([], 0)
    if len(norm_words) >= 2:
        results, top_score = search_verses(query, verses_data)
    
    req_score = max(1, len([w for w in norm_words if w not in {"is","the","a","in"}]) // 2)

    if results and top_score >= req_score:
        print("SOURCE: DATABASE")
        v = results[0]
        # Deterministic formatting to mimic AI but localized
        if req.language == "hi":
            data = {
                "shloka_sanskrit": v.get("text", ""),
                "shloka_english": v.get("translation", ""), # Keep translation as is (English translation field)
                "chapter_verse": f"अध्याय {v.get('chapter')}, श्लोक {v.get('verse')}",
                "opening_line": "उठो पार्थ! ज्ञान तुम्हारा इंतज़ार कर रहा है।",
                "problem_reflection": "आप इस स्थिति में स्पष्टता की चुनौती का सामना कर रहे हैं।",
                "core_message": v.get("translation", ""),
                "krishna_guidance": v.get("meaning", ""),
                "how_it_applies": "यह शिक्षा आपकी वर्तमान मनःस्थिति को सीधे संबोधित करती है।",
                "practical_steps": ["इस श्लोक पर विचार करें।", "बिना आसक्ति के कार्य करें।", "केंद्रित रहें।"],
                "daily_practice": "आज इस श्लोक का पाठ करें।",
                "deeper_wisdom": "आत्मा शाश्वत है, और सत्य भी।",
                "reflection_question": "यह श्लोक आपके दृष्टिकोण को कैसे बदलता है?",
                "their_problem": "खोज का एक क्षण।"
            }
        else:
            data = {
                "shloka_sanskrit": v.get("text", ""),
                "shloka_english": v.get("translation", ""),
                "chapter_verse": f"Chapter {v.get('chapter')}, Verse {v.get('verse')}",
                "opening_line": "Arise, O Arjuna! Wisdom awaits you.",
                "problem_reflection": "You are facing a challenge of clarity regarding this situation.",
                "core_message": v.get("translation", ""),
                "krishna_guidance": v.get("meaning", ""),
                "how_it_applies": "This verse directly addresses your current state of mind.",
                "practical_steps": ["Reflect on this verse.", "Act without attachment.", "Stay centered."],
                "daily_practice": "Recite this shloka today.",
                "deeper_wisdom": "The soul is eternal, and so is truth.",
                "reflection_question": "How does this verse change your perspective?",
                "their_problem": "A moment of seeking."
            }
        res = {"success": True, "data": data, "source": "database", "latency_ms": 0}
        query_cache.put(cache_key, res)
        res["latency_ms"] = int((time.time()-start)*1000)
        return res

    print("SOURCE: API")
    lang_instr = "\n\nCRITICAL: You MUST write ALL JSON values in HINDI, EXCEPT 'shloka_sanskrit' which MUST stay in Sanskrit Devanagari." if req.language == "hi" else "\n\nCRITICAL: The 'shloka_sanskrit' field MUST be the original Sanskrit verse (Devanagari)."
    try:
        response = gemini_model.generate_content(
            f"{SYSTEM_PROMPT}{lang_instr}\n\nUser Problem: {query}",
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        res = {"success": True, "data": data, "source": "api", "latency_ms": 0}
        query_cache.put(cache_key, res)
        res["latency_ms"] = int((time.time()-start)*1000)
        return res
    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(status_code=500, detail="Spiritual connection interrupted.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
