import json
import time
import os
import string
from collections import OrderedDict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv('../.env.local')  

print("Initializing SaarthiAI Engine (Short & Insightful Style)...")
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

# KRISHNA-STYLE SYSTEM PROMPT
SYSTEM_PROMPT = """You are Saarathi (सारथी), speaking with the calm, sharp, and thought-provoking voice of Krishna.
Your goal is to provide guidance that is short, deep, and practical.

STYLE RULES:
1. KRISHNA'S VOICE: Do not be direct. Describe human nature and let the user realize the truth.
2. BREVITY: Total response must be readable in 10-15 seconds.
3. NO NUMBERING: Do not use (1)(2)(3) or bullet lists with numbers.
4. LANGUAGE: Use ONLY ONE language (English or Hindi).

STRICT JSON STRUCTURE:
{
  "verse_ref": "BG X.Y",
  "verse": "Original Sanskrit (Short)",
  "insight": "2-3 lines of indirect, deep teaching about human nature",
  "meaning_for_you": "1-2 lines directly connecting the teaching to the user's specific query",
  "action": ["Short practical step", "Short practical step"]
}"""

print(f"Initialization complete in {time.time() - start_time:.2f}s")

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

    if results and top_score >= req_score:
        v = results[0]
        data = {
            "verse_ref": f"BG {v.get('chapter')}.{v.get('verse')}",
            "verse": v.get("text"),
            "insight": v.get("translation"),
            "meaning_for_you": f"Your path regarding '{query}' is found in understanding this balance.",
            "action": ["Observe your intent in this moment.", "Choose clarity over impulse today."]
        }
        if req.language == "hi":
            data["meaning_for_you"] = f"'{query}' के संबंध में आपका मार्ग इस संतुलन को समझने में निहित है।"
            data["action"] = ["इस क्षण में अपने इरादे का निरीक्षण करें।", "आज आवेग के बजाय स्पष्टता चुनें।"]

        res = {"success": True, "data": data, "source": "database", "latency_ms": 0}
        query_cache.put(cache_key, res)
        res["latency_ms"] = int((time.time()-start)*1000)
        return res

    lang_instr = f"\n\nCRITICAL: Use ONLY { 'HINDI' if req.language == 'hi' else 'ENGLISH' }."
    try:
        response = gemini_model.generate_content(f"{SYSTEM_PROMPT}{lang_instr}\n\nUser Query: {query}", generation_config={"response_mime_type": "application/json"})
        data = json.loads(response.text)
        res = {"success": True, "data": data, "source": "api", "latency_ms": 0}
        query_cache.put(cache_key, res)
        res["latency_ms"] = int((time.time()-start)*1000)
        return res
    except:
        raise HTTPException(status_code=500, detail="Spiritual connection interrupted.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
