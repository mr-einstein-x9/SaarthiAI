import json
import os

folder_path = "data"
all_verses = []

# Step 1: Load all files
for filename in sorted(os.listdir(folder_path)):
    if filename.endswith(".json"):
        with open(os.path.join(folder_path, filename), "r", encoding="utf-8") as f:
            chapter_data = json.load(f)

            if isinstance(chapter_data, list):
                all_verses.extend(chapter_data)
            else:
                all_verses.extend(chapter_data.get("verses", []))

# Step 2: Standardize keys
cleaned = []

for v in all_verses:
    text = ""
    if isinstance(v.get("sanskrit"), dict):
        text = v["sanskrit"].get("devanagari", "")
    else:
        text = v.get("slok") or v.get("text") or v.get("sanskrit", "")
        
    translation = ""
    if isinstance(v.get("english"), dict):
        translation = v["english"].get("translation", "")
    else:
        translation = v.get("translation", "")
        
    meaning = ""
    if isinstance(v.get("english"), dict):
        meaning = v["english"].get("explanation", "")
    else:
        meaning = v.get("commentary") or v.get("meaning") or ""

    cleaned.append({
        "chapter": v.get("chapter") or v.get("chapter_number"),
        "verse": v.get("verse") or v.get("verse_number"),
        "text": text,
        "translation": translation,
        "meaning": meaning
    })

# Step 3: Save final file
with open("geeta.json", "w", encoding="utf-8") as f:
    json.dump(cleaned, f, ensure_ascii=False, indent=2)

print("Total verses:", len(cleaned))