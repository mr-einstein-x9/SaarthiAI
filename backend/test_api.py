import requests
import json
import time

URL = "http://localhost:8001/ask"

test_queries = [
    # 1. Direct High Confidence Match (> 0.50)
    "I am confused about my duty and have lost all composure", # Literal translation of 2.7
    
    # 2. Medium Confidence (0.30 - 0.49) -> Local LLM
    "I am feeling very tired and cannot work anymore without purpose",
    
    # 3. Low Confidence / Abstract (< 0.30) -> Cloud LLM
    "Why does God allow suffering in this beautiful universe?",
    
    # 4. Semantic Cache Hit (> 0.85) - Same meaning as #1
    "I am confused about my duty and have lost all composure" 
]

print("Running SaarthiAI RAG Engine Tests...")

for i, q in enumerate(test_queries):
    print(f"\n--- TEST {i+1} ---")
    print(f"Query: {q}")
    start = time.time()
    try:
        response = requests.post(URL, json={"query": q}, timeout=10)
        data = response.json()
        print(f"Status: {response.status_code}")
        print(f"Confidence Tier: {data.get('confidence_tier')}")
        print(f"Latency MS: {data.get('latency_ms')}")
        print(f"Ref: {data.get('verse_ref')}")
        print(f"Guidance excerpt: {data.get('guidance')[:100]}...")
    except Exception as e:
        print(f"Failed to fetch: {e}")
    time.sleep(1) # small pause between tests
