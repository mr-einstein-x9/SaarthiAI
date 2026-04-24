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
print("Initializing SaarthiAI Engine (High Quality Refinement)...")
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

# STRICT SYSTEM PROMPT
SYSTEM_PROMPT = """You are Saarathi (सारथी), Krishna's charioteer and spiritual guide. 
Your goal is to provide clean, structured, and relevant guidance based on the Bhagavad Gita.

RULES:
1. LANGUAGE CONSISTENCY: Use ONLY ONE primary language for all explanations (English or Hindi as requested). Do NOT mix languages.
2. SANSKRIT PRESERVATION: The 'text' field MUST be the original Sanskrit verse in Devanagari.
3. NO HALLUCINATIONS: Do NOT invent spiritual catchphrases or titles like 'Krishna's first word'.
4. ALIGNMENT: The 'explanation' must directly connect the verse's wisdom to the user's specific query.
5. CONCISENESS: Keep explanations between 3-5 lines.

STRICT JSON RESPONSE FORMAT:
{
  "verse": {
    "chapter": number,
    "verse": number,
    "text": "Original Sanskrit",
    "translation": "Direct Translation",
    "meaning": "Core philosophical meaning"
  },
  "explanation": "Direct connection between verse and user query (3-5 lines)",
  "action": "2-3 practical, actionable bullet points",
  "relevance": "One sentence on why this verse was chosen"
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
    allow_origins=["*"], 
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
        # Pure database-driven response (No Hallucinations)
        data = {
            "verse": {
                "chapter": v.get("chapter"),
                "verse": v.get("verse"),
                "text": v.get("text"),
                "translation": v.get("translation"),
                "meaning": v.get("meaning")
            },
            "explanation": v.get("meaning"),
            "action": "Reflect on how this teaching of duty and mindfulness applies to your situation.",
            "relevance": f"This verse addresses your query about '{query}' by explaining the underlying spiritual principle."
        }
        
        # Localized boilerplate if needed (Avoid mixing languages)
        if req.language == "hi":
            data["explanation"] = v.get("meaning") # Note: meaning is English in geeta.json
            data["action"] = "विचार करें कि कर्तव्य और जागरूकता की यह शिक्षा आपकी स्थिति पर कैसे लागू होती है।"
            data["relevance"] = f"यह श्लोक आध्यात्मिक सिद्धांत की व्याख्या करके '{query}' के बारे में आपके प्रश्न का समाधान करता है।"

        res = {"success": True, "data": data, "source": "database", "latency_ms": 0}
        query_cache.put(cache_key, res)
        res["latency_ms"] = int((time.time()-start)*1000)
        return res

    print("SOURCE: API")
    lang_instr = f"\n\nCRITICAL: Use ONLY { 'HINDI' if req.language == 'hi' else 'ENGLISH' } for all fields except 'text'."
    try:
        response = gemini_model.generate_content(
            f"{SYSTEM_PROMPT}{lang_instr}\n\nUser Query: {query}",
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
