import os
import json
import random
import re
import time
from pathlib import Path

# 尝试导入
try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

# --- 配置 ---
ROOT = Path(__file__).resolve().parents[1]
TOOLS_DIR = ROOT / "data" / "tools"
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# ✅ 修改点：使用您支持的模型
MODEL_NAME = "gemini-2.5-flash"

# --- 保底题库 (API 挂了也能用) ---
FALLBACK_TOPICS = [
    "pool-volume-calculator", "dog-chocolate-toxicity-calculator", 
    "bmi-calculator-metric", "loan-repayment-calculator",
    "tile-calculator-bathroom", "concrete-slab-calculator",
    "paint-coverage-calculator", "water-intake-calculator",
    "electricity-cost-calculator", "roof-area-calculator",
    "cat-age-calculator", "dog-age-calculator",
    "aquarium-volume-calculator", "plant-light-calculator"
]

def debug(msg):
    print(f"[\033[94mDEBUG\033[0m] {msg}")

def clean_json(text):
    if not text: return None
    # 清理 markdown
    text = re.sub(r"```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"```", "", text)
    try:
        # 尝试提取 JSON 对象
        match = re.search(r"(\{.*\})", text, re.DOTALL)
        if match: return json.loads(match.group(1))
        return json.loads(text)
    except:
        return None

def generate_offline_tool(slug):
    """离线生成器"""
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
    debug(f"Starting Generation using model: {MODEL_NAME}...")
    
    if HAS_GENAI and GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    else:
        debug("⚠️ API Key missing or lib not found. Will use Offline Mode.")

    existing = {f.stem for f in TOOLS_DIR.glob("*.json")}
    
    # 找出还没生成的保底题目
    targets = [t for t in FALLBACK_TOPICS if t not in existing]
    
    # 如果为了演示，随机覆盖一个
    if not targets:
        debug("All fallback topics exist. Overwriting one for demo...")
        targets = [random.choice(FALLBACK_TOPICS)]
    
    # 限制每次运行生成 5 个
    targets = targets[:5]

    for topic in targets:
        debug(f"Processing: {topic}...")
        data = None
        
        # 1. 尝试 AI 生成 (使用 Gemini 2.5 Flash)
        if HAS_GENAI and GEMINI_API_KEY:
            try:
                model = genai.GenerativeModel(MODEL_NAME)
                prompt = f'Create JSON config for calculator "{topic}". Schema: {{"slug":"{topic}","title":"Title","inputs":[],"formula":"...","outputs":[],"faq":[]}}. JSON ONLY.'
                resp = model.generate_content(prompt)
                data = clean_json(resp.text)
                if data: debug("✅ AI Generation Successful")
            except Exception as e:
                debug(f"❌ AI Failed ({type(e).__name__}): {e}")
        
        # 2. 失败则用离线保底
        if not data:
            debug("👉 Using Offline Fallback.")
            data = generate_offline_tool(topic)

        # 3. 保存
        if data:
            with open(TOOLS_DIR / f"{topic}.json", "w") as f:
                json.dump(data, f, indent=2)
            debug(f"🎉 Saved to {topic}.json")
            # 休息一下防止超速
            time.sleep(1)

if __name__ == "__main__":
    main()
