import os
import json
import random
import re
from pathlib import Path
import time

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

ROOT = Path(__file__).resolve().parents[1]
TOOLS_DIR = ROOT / "data" / "tools"
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

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
    """质检员：如果 AI 漏了字段，自动补全，并填充长文/摘要"""
    if not data:
        return None

    # 强制修正 slug
    data["slug"] = slug

    # 1. 补全 Title
    if "title" not in data or not data["title"]:
        data["title"] = slug.replace("-", " ").title()

    # 2. 补全 summary
    if "summary" not in data or not data["summary"]:
        data["summary"] = f"{data['title']} helps you compute results accurately with domain-specific logic and guardrails."

    # 3. 补全 SEO (最关键的报错点)
    if "seo" not in data or not data.get("seo"):
        debug(f"⚠️ Fixing missing SEO for {slug}")
        data["seo"] = {
            "title": f"{data['title']} - Free Online Calculator",
            "description": f"Use our {data['title']} to get instant results with clear explanations and practical tips.",
        }

    # 4. 补全 inputs/outputs 防止页面崩溃
    if "inputs" not in data or not data["inputs"]:
        data["inputs"] = [{"id": "val", "label": "Value", "type": "number", "placeholder": "10", "required": True}]
    if "outputs" not in data or not data["outputs"]:
        data["outputs"] = [{"id": "result", "label": "Result", "unit": "unit"}]

    # 5. FAQ 保底 5 条
    faqs = data.get("faq", [])
    if not isinstance(faqs, list):
        faqs = []
    while len(faqs) < 5:
        faqs.append(
            {
                "q": f"How to use {data['title']}?",
                "a": "Enter your inputs with correct units, run the calculation, and review outputs plus notes. Adjust inputs if needed.",
            }
        )
    data["faq"] = faqs

    # 6. 文章厚度：3 段落，约 800 字（模板填充）
    article = data.get("article", [])
    if not isinstance(article, list):
        article = []
    if len(article) < 3:
        why = (
            f"{data['title']} saves time versus manual spreadsheets and generic formulas. "
            f"It applies domain-specific guardrails, units, and conditional logic so you avoid costly mistakes. "
            f"Use it to validate quick scenarios and communicate assumptions with teammates."
        )
        how = (
            "We normalize your inputs, convert units, and apply ratios, conditionals, caps, and safety factors where appropriate. "
            "Outputs include primary metrics and helper values so you can sanity-check results. "
            "If a value looks off, adjust inputs and rerun—the calculator is designed for rapid iteration."
        )
        mistakes = (
            "Common mistakes include mixing units, ignoring limits/caps, and skipping edge cases. "
            "Users also under-account for losses, inefficiencies, or seasonal factors. "
            "This tool surfaces key considerations to reduce those risks."
        )
        article = [
            {"heading": f"Why use {data['title']}?", "body": why},
            {"heading": "How the calculation works", "body": how},
            {"heading": "Common mistakes in this niche", "body": mistakes},
        ]
    data["article"] = article

    # 7. related 至少空数组
    related = data.get("related", [])
    if not isinstance(related, list):
        related = []
    data["related"] = related

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
