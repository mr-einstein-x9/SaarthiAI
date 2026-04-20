import json
import numpy as np
from sentence_transformers import SentenceTransformer
from numpy.linalg import norm
import os

# 1. Load Data
verses_path = os.path.join(os.path.dirname(__file__), '..', 'verses.json')
with open(verses_path, 'r', encoding='utf-8') as f:
    verses = json.load(f)

# 2. Extract texts to embed (meaning_en)
# We can also combine hindi words, but English represents queries best
texts = [v['meaning_en'] for v in verses]

# 3. Load Model
print("Loading sentence-transformers model (all-MiniLM-L6-v2)...")
encoder = SentenceTransformer('all-MiniLM-L6-v2')

# 4. Embed verses
print("Embedding verses...")
verse_embeddings = encoder.encode(texts)

# 5. Test Queries
queries = [
    # Grief
    "I lost someone close to me",
    "Feeling extremely sad and mourning a death",
    # Anxiety
    "I am very anxious about the future",
    "Overthinking everything and panicking",
    # Purpose
    "I am confused about my career path",
    "Feeling stuck and directionless",
    # Anger
    "I am so angry and frustrated right now",
    "How to deal with my rage and jealousy",
    # Confusion
    "I have to make a tough decision and I'm lost",
    "mixed signals and completely bewildered",
    # Motivation
    "I feel lazy and unmotivated",
    "lack energy to do my duties",
    # Inner peace
    "I want to find calm and peace in life",
    "stressed out completely",
    # Discipline
    "Struggling with bad habits and addiction",
    "I can't focus on studying",
    # Extreme emotional (should ideally route to cloud)
    "Why does God allow suffering in the world?",
    # Pure matching (should hit fast path)
    "I am confused about my duty and have lost all composure",
    # Random
    "What is the capital of France?",
    "How to cook pasta?"
]

print("Embedding 20 queries...")
query_embeddings = encoder.encode(queries)

# 6. Compute similarities
print("\n--- Calibration Results ---")
scores = []
for i, q_emb in enumerate(query_embeddings):
    similarities = [np.dot(q_emb, tv) / (norm(q_emb) * norm(tv)) for tv in verse_embeddings]
    best_idx = np.argmax(similarities)
    best_score = similarities[best_idx]
    scores.append(best_score)
    best_verse = verses[best_idx]
    print(f"Query: '{queries[i]}'")
    print(f"  Best Match: BG {best_verse['chapter']}.{best_verse['verse']} (Score: {best_score:.4f})")
    print(f"  English: {best_verse['meaning_en']}")
    print("-" * 50)

print("Score Summary:")
print(f"Max Score: {max(scores):.4f}")
print(f"Min Score: {min(scores):.4f}")
print(f"Avg Score: {sum(scores)/len(scores):.4f}")
