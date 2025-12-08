"""
Advanced tool generator with strategy mode and content-heavy outputs.

Features:
- Strategy mode (default): Gemini plans high-value low-competition niches and returns topics.
- Strong prompt: requires 3-8 inputs, >=2 outputs, multi-step formula, 5-8 FAQs, related slugs, and ~800-word article with 3 fixed sections.
- Validation/fallbacks to avoid empty content.
"""

from __future__ import annotations

import argparse
import json
import os
import random
import re
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List

try:
    import google.generativeai as genai  # type: ignore

    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

ROOT = Path(__file__).resolve().parents[1]
TOOLS_DIR = ROOT / "data" / "tools"
LOG_FILE = ROOT / "data" / "tool_generation_log.csv"
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


# ---------- Data model ----------
@dataclass
class ToolConfig:
    slug: str
    title: str
    seo: Dict[str, str]
    inputs: List[Dict[str, Any]]
    outputs: List[Dict[str, Any]]
    formula: str
    summary: str | None = None
    cta: str | None = None
    faq: List[Dict[str, str]] | None = None
    tags: List[str] | None = None
    related: List[str] | None = None
    article: List[Dict[str, str]] | None = None

    def to_dict(self) -> Dict[str, Any]:
        data: Dict[str, Any] = {
            "slug": self.slug,
            "title": self.title,
            "seo": self.seo,
            "inputs": self.inputs,
            "outputs": self.outputs,
            "formula": self.formula,
        }
        if self.summary:
            data["summary"] = self.summary
        if self.cta:
            data["cta"] = self.cta
        if self.faq:
            data["faq"] = self.faq
        if self.tags:
            data["tags"] = self.tags
        if self.related is not None:
            data["related"] = self.related
        if self.article:
            data["article"] = self.article
        return data


# ---------- Helpers ----------
def sanitize_slug(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return slug or f"tool-{random.randint(1000, 9999)}"


def ensure_dirs() -> None:
    TOOLS_DIR.mkdir(parents=True, exist_ok=True)
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)


def clean_json(text: str | None) -> Dict[str, Any] | None:
    if not text:
        return None
    cleaned = re.sub(r"```json\s*", "", text, flags=re.IGNORECASE)
    cleaned = re.sub(r"```", "", cleaned)
    try:
        match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        return json.loads(cleaned)
    except Exception:
        return None


def append_log(slug: str, title: str, path: Path) -> None:
    ensure_dirs()
    header_needed = not LOG_FILE.exists()
    with LOG_FILE.open("a", encoding="utf-8") as fh:
        if header_needed:
            fh.write("timestamp_utc,slug,title,path\n")
        fh.write(f"{datetime.utcnow().isoformat(timespec='seconds')}Z,{slug},{title},{path}\n")


# ---------- Content generation ----------
def plan_topics_with_gemini(api_key: str, plan_count: int, niches: str) -> List[str]:
    if not HAS_GENAI:
        return []
    genai.configure(api_key=api_key)
    prompt = f"""Act as a market research agent for calculator tools.
First, list 10 niche micro-tool markets where Google AdSense CPC is high but search competition is low.
Then, pick ONE best domain among these: {niches}.
For the chosen domain, return a JSON array of {plan_count} calculator ideas (short slugs/titles), focusing on high-need formulas (not trivial multipliers).
Format strictly as JSON array of strings, no extra text."""
    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)
    text = response.text or "[]"
    try:
        topics = json.loads(text)
        if not isinstance(topics, list):
            raise ValueError("Plan result is not a list")
        return [sanitize_slug(str(t)) for t in topics][:plan_count]
    except Exception:
        print("Warning: could not parse strategy plan JSON, got:", text[:200])
        return []


def generate_with_gemini(topic: str, api_key: str) -> ToolConfig | None:
    if not HAS_GENAI:
        return None
    genai.configure(api_key=api_key)
    prompt = f"""You are generating a JSON config for a calculator about "{topic}".
Return only valid JSON with fields: slug, title, seo{{title,description}}, summary,
inputs[id,label,type(number|text),placeholder,required,step?],
outputs[id,label,unit?,precision?],
formula (JavaScript body returning an object), cta,
faq(list of {{q,a}} 5-8 items), tags(list of strings),
related(slugs of similar tools), article(list of sections with heading, body).
Constraints:
- 3-8 inputs, at least 2 outputs. Use realistic domain units and steps.
- Formula must include multiple operations (not just single multiply/divide), e.g., ratios, exponent, conditionals/ternary, caps.
- Article: ~800 words total, EXACT sections:
  1) "Why use this {topic}?"
  2) "How the calculation works"
  3) "Common mistakes in {topic}"
- FAQ: 5-8 helpful, non-duplicated items.
- Slug must be URL-safe (lowercase, hyphenated).
Respond with JSON only."""
    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)
    data = clean_json(response.text)
    if not data:
        return None
    slug = data.get("slug") or sanitize_slug(topic)
    data["slug"] = slug
    return validate_and_fix(data, slug)


# ---------- Validation / fallback ----------
def validate_and_fix(data: Dict[str, Any], slug: str) -> ToolConfig:
    data = dict(data)
    data["slug"] = slug
    data["title"] = data.get("title") or slug.replace("-", " ").title()
    data["summary"] = data.get("summary") or (
        f"{data['title']} helps you compute results accurately with domain-specific guardrails and explanations."
    )
    if not data.get("seo"):
        data["seo"] = {
            "title": f"{data['title']} - Free Online Calculator",
            "description": f"Use our {data['title']} with detailed explanations, FAQs, and related tools.",
        }
    if not isinstance(data.get("inputs"), list) or not data["inputs"]:
        data["inputs"] = [
            {"id": "val", "label": "Value", "type": "number", "placeholder": "10", "required": True}
        ]
    if not isinstance(data.get("outputs"), list) or not data["outputs"]:
        data["outputs"] = [{"id": "result", "label": "Result", "unit": "unit"}]
    faqs = data.get("faq", [])
    if not isinstance(faqs, list):
        faqs = []
    while len(faqs) < 5:
        faqs.append(
            {
                "q": f"How to use {data['title']}?",
                "a": "Enter inputs with correct units, run, then review outputs and notes. Adjust and rerun if needed.",
            }
        )
    data["faq"] = faqs[:8]
    article = data.get("article", [])
    if not isinstance(article, list):
        article = []
    if len(article) < 3:
        why = (
            f"{data['title']} saves time versus manual spreadsheets, applying domain guardrails and unit handling. "
            f"Use it for quick what-if scenarios and to communicate assumptions."
        )
        how = (
            "We normalize inputs, convert units, apply ratios, conditionals, caps, and safety factors, "
            "then return primary and helper outputs so you can sanity-check results."
        )
        mistakes = (
            "Common mistakes include mixing units, ignoring limits/caps, skipping losses/inefficiencies, "
            "and missing edge cases. This tool surfaces these considerations explicitly."
        )
        article = [
            {"heading": f"Why use {data['title']}?", "body": why},
            {"heading": "How the calculation works", "body": how},
            {"heading": "Common mistakes in this niche", "body": mistakes},
        ]
    data["article"] = article
    related = data.get("related", [])
    if not isinstance(related, list):
        related = []
    data["related"] = related

    return ToolConfig(
        slug=data["slug"],
        title=data["title"],
        seo=data["seo"],
        inputs=data["inputs"],
        outputs=data["outputs"],
        formula=data.get("formula") or "return { result: 0 };",
        summary=data.get("summary"),
        cta=data.get("cta") or "Calculate",
        faq=data["faq"],
        tags=data.get("tags") or [],
        related=data["related"],
        article=data["article"],
    )


def generate_offline_tool(slug: str) -> ToolConfig:
    title = slug.replace("-", " ").title()
    return ToolConfig(
        slug=slug,
        title=title,
        seo={"title": f"{title} Free Tool", "description": f"Calculate {title} online."},
        inputs=[{"id": "val", "label": "Value", "type": "number", "placeholder": "10", "required": True}],
        outputs=[{"id": "result", "label": "Result", "unit": "unit"}],
        formula="const result = val * 1; return { result };",
        summary=f"{title} helps you compute results quickly.",
        cta="Calculate",
        faq=[{"q": "How to use?", "a": "Enter value and calculate."}],
        tags=["tool", "calculator"],
        related=[],
        article=[
            {"heading": f"Why use {title}?", "body": f"{title} provides a quick baseline calculation."},
            {"heading": "How the calculation works", "body": "It multiplies your input by 1 as a placeholder."},
            {"heading": "Common mistakes in this niche", "body": "Avoid unit mix-ups; use correct inputs."},
        ],
    )


# ---------- CLI ----------
def iter_topics_from_file(path: Path) -> Iterable[str]:
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            topic = line.strip()
            if topic:
                yield topic


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Generate tool JSON configs.")
    parser.add_argument("--topic", help="Single domain or calculator idea.")
    parser.add_argument("--topics-file", type=Path, help="Path to a file with one topic per line.")
    parser.add_argument("--max-per-day", type=int, default=20, help="Max items to generate.")
    parser.add_argument("--log", action="store_true", help="Append CSV log.")
    parser.add_argument("--shuffle", action="store_true", help="Shuffle topics.")
    parser.add_argument("--strategy", action="store_true", help="Use strategy planning via Gemini.")
    parser.add_argument("--plan-count", type=int, default=20, help="Topics to request in strategy.")
    parser.add_argument("--niches", type=str, default="gardening, finance, health", help="Comma-separated niches.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing file if exists.")
    parser.add_argument("--mock", action="store_true", help="Force mock mode (no API calls).")
    parser.add_argument("--slug", help="Optional slug override for single topic.")
    args = parser.parse_args(argv)

    if not args.topic and not args.topics_file and not args.strategy:
        parser.error("Provide --topic or --topics-file or --strategy")

    topics: List[str] = []
    api_key = GEMINI_API_KEY
    use_mock = args.mock or not (api_key and HAS_GENAI)

    if args.strategy and not use_mock:
        topics = plan_topics_with_gemini(api_key, args.plan_count, args.niches)
        if args.shuffle:
            random.shuffle(topics)
        if not topics:
            print("Strategy returned no topics; falling back to topics file or single topic.")
    if not topics and args.topics_file:
        topics = list(iter_topics_from_file(args.topics_file))
        if args.shuffle:
            random.shuffle(topics)
    if not topics and args.topic:
        topics = [args.topic]

    generated = 0
    for topic in topics:
        if generated >= args.max_per_day:
            print(f"Reached daily cap ({args.max_per_day}), stopping.")
            break
        slug = sanitize_slug(args.slug or topic)
        tool: ToolConfig | None = None
        if not use_mock:
            tool = generate_with_gemini(topic, api_key)  # type: ignore[arg-type]
        if not tool:
            tool = generate_offline_tool(slug)
        # ensure slug matches filename
        tool.slug = slug
        path = TOOLS_DIR / f"{slug}.json"
        if path.exists() and not args.force:
            print(f"Skip existing {slug}")
            continue
        ensure_dirs()
        with path.open("w", encoding="utf-8") as fh:
            json.dump(tool.to_dict(), fh, indent=2, ensure_ascii=False)
            fh.write("\n")
        if args.log:
            append_log(tool.slug, tool.title, path)
        generated += 1
        print(f"Saved {tool.title} to {path}")

    print(f"Complete. Generated: {generated}/{len(topics)} (cap {args.max_per_day}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
