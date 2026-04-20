import json
import time
import os
import requests
from collections import OrderedDict

import numpy as np
from numpy.linalg import norm
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables (for GEMINI API KEY if present)
load_dotenv('../.env.local')  # from Next.js project root

# --- SYSTEM INITIALIZATION ---
print("Initializing SaarthiAI Engine...")
start_time = time.time()

# 1. Load Data
verses_path = os.path.join(os.path.dirname(__file__), '..', 'verses.json')
try:
    with open(verses_path, 'r', encoding='utf-8') as f:
        verses_data = json.load(f)
except FileNotFoundError:
    # Dummy fallback in case file is absent
    verses_data = [{"id": "2.47", "chapter": 2, "verse": 47, "sanskrit": "कर्मण्येवाधिकारस्ते...", "transliteration": "karmaṇy-evādhikāras...", "meaning_en": "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action."}]

# Extract texts (We will map by index)
verse_texts = [v.get('meaning_en', 'Wisdom is eternal.') for v in verses_data]

# 2. Load Model
encoder = SentenceTransformer('all-MiniLM-L6-v2')
print("Embedding verses...")
verse_embeddings = encoder.encode(verse_texts)

# 3. Setup Gemini
api_key = os.environ.get("GEMINI_API_KEY", "dummy_key")
genai.configure(api_key=api_key)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

print(f"Initialization complete in {time.time() - start_time:.2f}s")


# --- TASK 3: BOUNDED SEMANTIC CACHE ---
class LRUSemanticCache:
    def __init__(self, max_size=500, threshold=0.85):
        # OrderedDict maintains insertion order (useful for LRU)
        self.cache = OrderedDict()
        self.max_size = max_size
        self.threshold = threshold

    def get(self, query_vector):
        if not self.cache:
            return None
            
        # Compare query_vector to all cached vectors
        cached_items = list(self.cache.items())  # List of tuples: (query, {"vector": [...], "response": GuidanceResponse dict})
        cached_vectors = [item[1]["vector"] for item in cached_items]
        
        # Calculate cosine similarity against cache
        similarities = [np.dot(query_vector, cv) / (norm(query_vector) * norm(cv)) for cv in cached_vectors]
        best_idx = int(np.argmax(similarities))
        best_score = float(similarities[best_idx])
        
        if best_score >= self.threshold:
            print(f"[CACHE] Semantic Cache Hit! (Score: {best_score:.4f})")
            matched_key = cached_items[best_idx][0]
            
            # Move to end to mark as recently used (LRU)
            self.cache.move_to_end(matched_key)
            return self.cache[matched_key]["response"]
            
        return None

    def put(self, original_query_text, query_vector, response_dict):
        # If full, drop the first item (least recently used)
        if len(self.cache) >= self.max_size:
            self.cache.popitem(last=False)
            
        self.cache[original_query_text] = {
            "vector": query_vector,
            "response": response_dict
        }

semantic_cache = LRUSemanticCache(max_size=500, threshold=0.85)


# --- TASK 5: FASTAPI CONTRACT ---
app = FastAPI(title="SaarthiAI RAG Engine")

class GuidanceRequest(BaseModel):
    query: str

class GuidanceResponse(BaseModel):
    guidance: str
    verse_ref: str
    confidence_tier: str  # "cache" | "direct" | "local" | "cloud" | "fallback"
    latency_ms: int

# --- API ENDPOINT ---
@app.post("/ask", response_model=GuidanceResponse)
def get_guidance(req: GuidanceRequest):
    req_start_time = time.time()
    query = req.query.strip()
    
    # 1. Embed user query locally
    query_vector = encoder.encode(query)
    
    # 2. Check Semantic Cache (Threshold >= 0.85)
    cached_res = semantic_cache.get(query_vector)
    if cached_res:
        cached_res["confidence_tier"] = "cache" # Update tier so we can trace it
        # Recalculate latency ms for cache hit
        cached_res["latency_ms"] = int((time.time() - req_start_time) * 1000)
        return cached_res

    # 3. Retrieve Best Verse
    similarities = [np.dot(query_vector, tv) / (norm(query_vector) * norm(tv)) for tv in verse_embeddings]
    best_idx = np.argmax(similarities)
    best_score = float(similarities[best_idx])
    best_verse = verses_data[best_idx]
    verse_ref = f"BG {best_verse.get('chapter', '?')}.{best_verse.get('verse', '?')}"
    
    print(f"Retrieval Score: {best_score:.4f} for {verse_ref}")
    
    final_guidance = ""
    confidence_tier = ""
    
    # --- TASK 4: 3-TIER FALLBACK CHAIN ---
    if best_score >= 0.50:
        # TIER 1: NO-LLM FAST PATH (High Confidence)
        confidence_tier = "direct"
        print("[DIRECT] Route: HIGH CONFIDENCE (Direct Fast Path)")
        
        # Task 2: No-LLM Response Template (Beautiful, structured formatting locally)
        sanskrit = best_verse.get("sanskrit", "").replace("\n", " ")
        english_trans = best_verse.get("meaning_en", "")
        
        # Generate predefined intro (Can be fetched from DB, but programmatic here)
        predefined_intro = "When the mind is steadfast, true perspective emerges."
        if "sad" in query.lower() or "loss" in query.lower() or "grief" in query.lower():
            predefined_intro = "The Gita reminds us of the eternal nature of the soul to bring comfort in times of grief."
        elif "confused" in query.lower():
            predefined_intro = "In moments of deep confusion, Lord Krishna anchors Arjuna to his righteous duty."
        
        final_guidance = f"{predefined_intro}\n\n*\"{sanskrit}\"*\n\n**Meaning:** {english_trans}"

    elif best_score >= 0.30:
        # TIER 2: LOCAL LLM (Medium Confidence)
        confidence_tier = "local"
        print("[LOCAL] Route: MEDIUM CONFIDENCE (Local Ollama)")
        prompt = f"User is feeling: '{query}'. Provide 2 comforting sentences using principles from {verse_ref}: '{best_verse.get('meaning_en')}'."
        
        try:
            res = requests.post(
                'http://localhost:11434/api/generate', 
                json={'model': 'llama3', 'prompt': prompt, 'stream': False}, 
                timeout=2.0 # 2.0s Timeout Fallback Condition!
            )
            res.raise_for_status()
            final_guidance = res.json()['response'].strip()
        except Exception as e:
            print(f"[WARN] Ollama Failed ({str(e)}). Falling back to Cloud LLM...")
            # Fallback to Cloud
            confidence_tier = "cloud_fallback"
            
            try:
                cloud_res = gemini_model.generate_content(prompt, request_options={"timeout": 5.0})
                final_guidance = cloud_res.text.strip()
            except Exception as e2:
                print(f"[ERROR] Cloud Fallback Failed ({str(e2)}). Using Static Error Responder.")
                confidence_tier = "fallback"
                final_guidance = f"We are experiencing high traffic, but the wisdom of the Gita remains eternal. Seek solace in this teaching ({verse_ref}): {best_verse.get('meaning_en')}"

    else:
        # TIER 3: CLOUD LLM (Low Confidence / Abstract)
        confidence_tier = "cloud"
        print("[CLOUD] Route: LOW CONFIDENCE (Cloud Gemini)")
        prompt = f"A user asks: '{query}'. Provide abstract, generalized comforting spiritual advice (2 sentences) referencing Bhagavad Gita themes."
        
        try:
            cloud_res = gemini_model.generate_content(prompt, request_options={"timeout": 5.0})
            final_guidance = cloud_res.text.strip()
        except Exception as e:
            print(f"[ERROR] Gemini Failed ({str(e)}). Using Static Error Responder.")
            confidence_tier = "fallback"
            final_guidance = "The path may seem unclear and our servers are momentarily disconnected, but peace lies within. Pause, breathe, and find clarity in stillness."

    # Validate final guidance is present
    if not final_guidance:
        confidence_tier = "fallback"
        final_guidance = f"Seek solace in this verse ({verse_ref}): {best_verse.get('meaning_en')}"

    # Calculate latency
    latency_ms = int((time.time() - req_start_time) * 1000)
    
    # Response Object
    resp_dict = {
        "guidance": final_guidance,
        "verse_ref": verse_ref,
        "confidence_tier": confidence_tier,
        "latency_ms": latency_ms
    }

    # Cache the result
    semantic_cache.put(query, query_vector, resp_dict)
    
    return GuidanceResponse(**resp_dict)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
