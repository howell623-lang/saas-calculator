import os
import json
import random
import re
import time
from pathlib import Path

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

ROOT = Path(__file__).resolve().parents[1]
TOOLS_DIR = ROOT / "data" / "tools"
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL_NAME = "gemini-2.5-flash"

FALLBACK_TOPICS = [
    "pool-volume-calculator", "dog-chocolate-toxicity-calculator", 
    "bmi-calculator-metric", "loan-repayment-calculator",
    "tile-calculator-bathroom", "concrete-slab-calculator",
    "paint-coverage-calculator", "water-intake-calculator",
    "electricity-cost-calculator", "roof-area-calculator"
]

def debug(msg):
    print(f"[\033[94mDEBUG\033[0m] {msg}")

def clean_json(text):
    if not text: return None
    text = re.sub(r"```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"```", "", text)
    try:
        match = re.search(r"(\{.*\})", text, re.DOTALL)
        if match: return json.loads(match.group(1))
        return json.loads(text)
    except:
        return None

def validate_and_fix(data, slug):
    """质检员：如果 AI 漏了字段，自动补全"""
    if not data: return None
    
    # 强制修正 slug
    data["slug"] = slug
    
    # 1. 补全 Title
    if "title" not in data or not data["title"]:
        data["title"] = slug.replace("-", " ").title()
        
    # 2. 补全 SEO (最关键的报错点)
    if "seo" not in data:
        debug(f"⚠️ Fixing missing SEO for {slug}")
        data["seo"] = {
            "title": f"{data['title']} - Free Online Calculator",
            "description": f"Use our free {data['title']} to get instant results. Accurate and easy to use."
        }
        
    # 3. 补全 inputs/outputs 防止页面崩溃
    if "inputs" not in data: data["inputs"] = []
    if "outputs" not in data: data["outputs"] = []
    if "faq" not in data: data["faq"] = []
    
    return data

def generate_offline_tool(slug):
    title = slug.replace("-", " ").title()
    return {
        "slug": slug,
        "title": title,
        "seo": {"title": f"{title} Free Tool", "description": f"Calculate {title} online."},
        "inputs": [{"id": "val", "label": "Value", "type": "number", "unit": "unit"}],
        "formula": "return { result: val * 1 };",
        "outputs": [{"id": "result", "label": "Result", "unit": "unit"}],
        "cta": "Calculate",
        "faq": [{"q": "How to use?", "a": "Enter value and calculate."}],
        "tags": ["tool", "calculator"]
    }

def main():
    debug(f"Starting Generation...")
    if HAS_GENAI and GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)

    existing = {f.stem for f in TOOLS_DIR.glob("*.json")}
    targets = [t for t in FALLBACK_TOPICS if t not in existing]
    
    # 如果没新词了，就覆盖旧的来测试
    if not targets:
        targets = [random.choice(FALLBACK_TOPICS)]
    
    targets = targets[:5]

    for topic in targets:
        debug(f"Processing: {topic}...")
        data = None
        
        if HAS_GENAI and GEMINI_API_KEY:
            try:
                model = genai.GenerativeModel(MODEL_NAME)
                # 提示词加强：强制要求 SEO 字段
                prompt = f'Create JSON config for calculator "{topic}". MUST include "seo" object with "title" and "description". Schema: {{"slug":"{topic}","title":"...","seo":{{"title":"...","description":"..."}},"inputs":[],"formula":"...","outputs":[],"faq":[]}}. JSON ONLY.'
                resp = model.generate_content(prompt)
                data = clean_json(resp.text)
            except Exception as e:
                debug(f"❌ AI Failed: {e}")
        
        if not data:
            data = generate_offline_tool(topic)

        # 核心步骤：不管数据哪来的，先过一遍质检和修复
        final_data = validate_and_fix(data, topic)

        if final_data:
            with open(TOOLS_DIR / f"{topic}.json", "w") as f:
                json.dump(final_data, f, indent=2)
            debug(f"🎉 Saved and Fixed: {topic}.json")
            time.sleep(1)

if __name__ == "__main__":
    main()
