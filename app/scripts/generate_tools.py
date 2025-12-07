import os
import json
import argparse
import random
import time
import csv
import re
from pathlib import Path
from dataclasses import dataclass
import google.generativeai as genai

# --- 配置部分 ---
ROOT = Path(__file__).resolve().parents[1]
TOOLS_DIR = ROOT / "data" / "tools"
LOG_FILE = ROOT / "data" / "tool_generation_log.csv"

# 确保目录存在
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

# 获取配置
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash") # 默认用 1.5 flash

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# --- 核心修复：强力清洗函数 ---
def clean_and_parse_json(text):
    """
    不管 AI 说什么废话，只提取其中的 JSON 部分。
    """
    if not text:
        return None

    # 1. 移除 Markdown 代码块标记 (```json ... ```)
    text = re.sub(r"```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"```", "", text)
    
    # 2. 核心修复：使用正则提取最外层的 [] 或 {}
    # 这能过滤掉开头的 "Here is the data:" 和结尾的 "Hope this helps!"
    try:
        # 找数组 [...]
        match_list = re.search(r"(\[.*\])", text, re.DOTALL)
        # 找对象 {...}
        match_obj = re.search(r"(\{.*\})", text, re.DOTALL)
        
        # 谁匹配得更长（更像完整内容）就用谁
        target = text # 默认还是原文本
        if match_list and match_obj:
            if len(match_list.group(1)) > len(match_obj.group(1)):
                target = match_list.group(1)
            else:
                target = match_obj.group(1)
        elif match_list:
            target = match_list.group(1)
        elif match_obj:
            target = match_obj.group(1)
            
        return json.loads(target.strip())
    except Exception as e:
        print(f"JSON Parsing failed: {e}")
        # print(f"Original text was: {text[:100]}...") # 调试用
        return None

def get_existing_slugs():
    return {f.stem for f in TOOLS_DIR.glob("*.json")}

def log_generation(tool_data):
    file_exists = LOG_FILE.exists()
    with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["date", "slug", "title", "path"])
        writer.writerow([
            time.strftime("%Y-%m-%d %H:%M:%S"),
            tool_data.get('slug', 'unknown'),
            tool_data.get('title', 'unknown'),
            f"data/tools/{tool_data.get('slug', 'unknown')}.json"
        ])

def generate_tool_content(topic):
    """生成单个工具"""
    if not GEMINI_API_KEY:
        return None

    print(f"Generating tool for topic: {topic}...")
    model = genai.GenerativeModel(MODEL_NAME)
    
    prompt = f"""
    Create a valid JSON config for a Next.js calculator tool about: "{topic}".
    Target: Engineering/Finance/Health professionals.
    
    JSON Schema:
    {{
      "slug": "kebab-case-unique-id",
      "title": "Clear Title",
      "seo": {{ "title": "SEO Title", "description": "SEO Desc" }},
      "inputs": [ {{ "id": "v1", "label": "Label", "type": "number", "unit": "kg" }} ],
      "formula": "return {{ result: v1 * 2 }};",
      "outputs": [ {{ "id": "result", "label": "Result", "unit": "kg" }} ],
      "cta": "Calculate",
      "faq": [ {{ "q": "Q", "a": "A" }} ],
      "tags": ["tag1"]
    }}
    RETURN JSON ONLY.
    """
    
    try:
        response = model.generate_content(prompt)
        data = clean_and_parse_json(response.text)
        if data and "slug" in data:
            return data
        return None
    except Exception as e:
        print(f"Tool generation failed for {topic}: {e}")
        return None

def generate_strategy_plan(count, niches):
    """策略模式：让 AI 生成计划表"""
    if not GEMINI_API_KEY:
        return []
        
    print(f"🧠 Brain is planning {count} tools for niches: {niches}...")
    model = genai.GenerativeModel(MODEL_NAME)
    
    prompt = f"""
    Act as a Product Manager.
    List {count} specific, high-value calculator ideas for: {niches}.
    Focus on: Construction, Engineering, Finance.
    
    Return STRICTLY a JSON list of strings.
    Example: ["steel-beam-load-calculator", "mortgage-amortization-calculator"]
    
    NO CONVERSATION. JUST THE ARRAY.
    """
    
    try:
        response = model.generate_content(prompt)
        plan = clean_and_parse_json(response.text)
        if isinstance(plan, list):
            return plan
        return []
    except Exception as e:
        print(f"Strategy planning failed: {e}")
        return []

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", help="Specific topic")
    parser.add_argument("--strategy", action="store_true", help="Use AI strategy")
    parser.add_argument("--file", help="Topics file")
    parser.add_argument("--max", type=int, default=20)
    args = parser.parse_args()

    existing_slugs = get_existing_slugs()
    topics = []

    # 1. 确定题目来源
    if args.topic:
        topics = [args.topic]
    elif args.strategy and GEMINI_API_KEY:
        niches = os.environ.get("NICHES", "engineering, finance, construction")
        topics = generate_strategy_plan(args.max, niches)
    
    # 回退机制
    if not topics and os.path.exists("scripts/topics.txt"):
        print("Falling back to local topics.txt")
        with open("scripts/topics.txt", "r") as f:
            lines = [l.strip() for l in f if l.strip()]
            random.shuffle(lines)
            topics = lines

    # 2. 生成循环
    count = 0
    for t in topics:
        if count >= args.max:
            break
            
        # 简单预检：如果 slug 已存在就跳过
        slug_guess = t.lower().replace(" ", "-")
        if slug_guess in existing_slugs:
            print(f"Skipping existing (guess): {slug_guess}")
            continue

        data = generate_tool_content(t)
        if data:
            slug = data['slug']
            if slug in existing_slugs:
                print(f"Skipping duplicate: {slug}")
                continue
                
            # 保存
            with open(TOOLS_DIR / f"{slug}.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            log_generation(data)
            existing_slugs.add(slug)
            count += 1
            print(f"✅ Generated: {slug}")
            time.sleep(2) # 防封

    print(f"Done. Generated {count}/{args.max}")

if __name__ == "__main__":
    main()