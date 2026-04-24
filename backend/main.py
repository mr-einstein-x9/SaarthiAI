import json
import time
import os
import requests
import string
from collections import OrderedDict

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables (for GEMINI API KEY if present)
load_dotenv('../.env.local')  # from Next.js project root

# --- SYSTEM INITIALIZATION ---
print("Initializing SaarthiAI Engine (Hybrid Local Search)...")
start_time = time.time()

def normalize_text(text):
    """Normalize text by converting to lowercase and removing punctuation."""
    if not text:
        return ""
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text

# 1. Load Data (geeta.json loaded once at startup)
verses_path = os.path.join(os.path.dirname(__file__), 'geeta.json')
try:
    with open(verses_path, 'r', encoding='utf-8') as f:
        verses_data = json.load(f)
        
    # Preprocess all verses at startup to reduce per-request computation
    for verse in verses_data:
        verse["translation_clean"] = normalize_text(verse.get("translation", ""))
        verse["meaning_clean"] = normalize_text(verse.get("meaning", ""))
except FileNotFoundError:
    print("[WARN] geeta.json not found! Using empty dataset.")
    verses_data = []

# 2. Setup Gemini
api_key = os.environ.get("GEMINI_API_KEY", "dummy_key")
genai.configure(api_key=api_key)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

print(f"Initialization complete in {time.time() - start_time:.2f}s")


# --- CACHE ---
# Simple In-Memory Cache with TTL to prevent memory growth
class SimpleCache:
    def __init__(self, max_size=500, ttl_seconds=300): # Default TTL = 5 minutes
        self.cache = OrderedDict()
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds

    def get(self, query):
        if query in self.cache:
            response_dict, timestamp = self.cache[query]
            
            # Check expiry
            if time.time() - timestamp > self.ttl_seconds:
                del self.cache[query]
                return None
                
            self.cache.move_to_end(query)
            return response_dict
        return None

    def put(self, query, response_dict):
        if len(self.cache) >= self.max_size:
            self.cache.popitem(last=False)
        self.cache[query] = (response_dict, time.time())

query_cache = SimpleCache()


# --- SEARCH LOGIC ---
def search_verses(query, dataset, top_k=3):
    """
    Search verses using tokenization and keyword scoring on pre-cleaned fields.
    Returns the top 'top_k' verses and the highest score.
    Future Upgrade: Replace keyword search with FAISS (semantic search) to handle synonyms.
    """
    norm_query = normalize_text(query)
    stopwords = {"is", "am", "are", "the", "a", "an", "and", "or", "to", "in", "of", "for", "with", "my", "i", "me", "how", "what", "why", "when", "where", "about", "it", "this", "that"}
    query_words = [w for w in norm_query.split() if w and w not in stopwords]
    
    if not query_words:
        return [], 0
        
    scored_verses = []
    for verse in dataset:
        score = 0
        # Use pre-cleaned fields
        text_content = f"{verse.get('translation_clean', '')} {verse.get('meaning_clean', '')}".split()
        
        # Track score per verse
        for w in query_words:
            if w in text_content:
                score += 1
        
        if score > 0:
            scored_verses.append({"verse": verse, "score": score})
            
    # Sort by score descending
    scored_verses.sort(key=lambda x: x["score"], reverse=True)
    
    # Strictly limit max results
    results = [item["verse"] for item in scored_verses[:top_k]]
    top_score = scored_verses[0]["score"] if scored_verses else 0
    return results, top_score


# --- FASTAPI CONTRACT ---
app = FastAPI(title="SaarthiAI RAG Engine")

class GuidanceRequest(BaseModel):
    query: str

class GuidanceResponse(BaseModel):
    guidance: str
    verse_ref: str
    confidence_tier: str  # "cache" | "direct" | "cloud" | "fallback"
    latency_ms: int
    source: str = "api"   # "database" OR "api"
    results: list = []    # Top verses from DB

# --- API ENDPOINT ---
@app.post("/ask", response_model=GuidanceResponse)
def get_guidance(req: GuidanceRequest):
    req_start_time = time.time()
    query = req.query.strip()
    
    # 1. Check Simple Cache
    cached_res = query_cache.get(query)
    if cached_res:
        print("SOURCE: CACHE")
        # Ensure we don't mutate the cached object's original reference permanently
        res_copy = cached_res.copy()
        res_copy["confidence_tier"] = "cache"
        res_copy["latency_ms"] = int((time.time() - req_start_time) * 1000)
        return GuidanceResponse(**res_copy)

    # Short query guard
    norm_query = normalize_text(query)
    all_query_words = norm_query.split()
    
    results = []
    top_score = 0
    required_score = 1
    
    # 2. Local Keyword Search (Skip DB if query < 2 words or meaningless)
    if len(all_query_words) >= 2:
        results, top_score = search_verses(query, verses_data, top_k=3)
        
        stopwords = {"is", "am", "are", "the", "a", "an", "and", "or", "to", "in", "of", "for", "with", "my", "i", "me", "how", "what", "why", "when", "where", "about", "it", "this", "that"}
        meaningful_words = [w for w in all_query_words if w not in stopwords]
        required_score = max(1, len(meaningful_words) // 2)
    else:
        print("[SKIP] Query too short, skipping DB search.")

    # 3. Routing Logic: DB Match vs API Fallback
    # Safe Fallback: If no results OR score is weak -> fallback to API
    if results and top_score >= required_score:
        print("SOURCE: DATABASE")
        
        best_verse = results[0]
        verse_ref = f"BG {best_verse.get('chapter', '?')}.{best_verse.get('verse', '?')}"
        sanskrit = best_verse.get("text", "").replace("\n", " ")
        english_trans = best_verse.get("translation", "")
        
        final_guidance = f"*{sanskrit}*\n\n**Meaning:** {english_trans}"
        confidence_tier = "direct"
        source = "database"
        
        # Ensure results have standard keys for frontend display
        # The frontend can map these to "Chapter X, Verse Y"
        
        resp_dict = {
            "guidance": final_guidance,
            "verse_ref": verse_ref,
            "confidence_tier": confidence_tier,
            "latency_ms": int((time.time() - req_start_time) * 1000),
            "source": source,
            "results": results
        }
        query_cache.put(query, resp_dict)
        return GuidanceResponse(**resp_dict)

    # 4. Fallback to Gemini API (Complex queries)
    print("SOURCE: API")
    prompt = f"A user asks: '{query}'. Provide abstract, generalized comforting spiritual advice (2 sentences) referencing Bhagavad Gita themes."
    
    final_guidance = ""
    confidence_tier = "cloud"
    verse_ref = "Bhagavad Gita"
    
    try:
        cloud_res = gemini_model.generate_content(prompt, request_options={"timeout": 5.0})
        final_guidance = cloud_res.text.strip()
    except Exception as e:
        print(f"[ERROR] Gemini Failed ({str(e)}). Using Static Error Responder.")
        confidence_tier = "fallback"
        final_guidance = "The path may seem unclear and our servers are momentarily disconnected, but peace lies within. Pause, breathe, and find clarity in stillness."

    resp_dict = {
        "guidance": final_guidance,
        "verse_ref": verse_ref,
        "confidence_tier": confidence_tier,
        "latency_ms": int((time.time() - req_start_time) * 1000),
        "source": "api",
        "results": []
    }
    
    # Cache the API result as well
    query_cache.put(query, resp_dict)
    
    return GuidanceResponse(**resp_dict)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
