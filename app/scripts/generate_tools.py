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
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional
from xml.etree import ElementTree as ET

try:
    import requests

    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

# ---- compat for Python < 3.10 (packages_distributions) ----
try:
    from importlib.metadata import packages_distributions as _pd  # type: ignore
except Exception:
    try:
        import importlib_metadata  # type: ignore
        import importlib.metadata as _ilm  # type: ignore

        if not hasattr(_ilm, "packages_distributions"):
            _ilm.packages_distributions = importlib_metadata.packages_distributions  # type: ignore
    except Exception:
        pass

try:
    import google.generativeai as genai  # type: ignore

    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

ROOT = Path(__file__).resolve().parents[1]
TOOLS_DIR = ROOT / "data" / "tools"
LOG_FILE = ROOT / "data" / "tool_generation_log.csv"
TRENDING_FEED_URL = os.environ.get(
    "TRENDING_FEED_URL",
    "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
)

CATEGORY_KEYWORDS: Dict[str, List[str]] = {
    "finance": [
        "loan",
        "mortgage",
        "investment",
        "market",
        "bank",
        "tax",
        "credit",
        "budget",
    ],
    "health": [
        "health",
        "hospital",
        "medical",
        "cancer",
        "virus",
        "diet",
        "fitness",
        "heart",
    ],
    "climate": ["climate", "heat", "storm", "weather", "temperature", "drought"],
    "energy": ["energy", "solar", "wind", "fuel", "power", "oil"],
    "construction": ["housing", "construction", "roof", "building", "concrete", "floor"],
    "technology": ["ai", "chip", "software", "device", "tech", "digital"],
    "education": ["school", "college", "education", "student", "tuition"],
    "lifestyle": ["travel", "nutrition", "wedding", "family", "pet", "garden"],
    "sports": ["game", "team", "tournament", "player", "score", "olympic"],
}
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


# ---------- Data model ----------
@dataclass
class TopicIdea:
    slug: str
    prompt: str
    category: Optional[str] = None
    source: Optional[str] = None


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


def categorize_topic(text: str) -> str:
    lowered = text.lower()
    words = set(re.findall(r"[a-z0-9]+", lowered))
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            keyword_lower = keyword.lower()
            if " " in keyword_lower:
                if keyword_lower in lowered:
                    return category
            elif keyword_lower in words:
                return category
    return "general"


def fetch_trending_topics(limit: int = 20) -> List[Dict[str, str]]:
    if not HAS_REQUESTS:
        print("Warning: requests is not installed; skipping trending fetch.")
        return []
    try:
        response = requests.get(TRENDING_FEED_URL, timeout=15)
        response.raise_for_status()
    except Exception as exc:
        print(f"Warning: unable to fetch trending feed ({exc})")
        return []
    try:
        root = ET.fromstring(response.text)
    except ET.ParseError as exc:
        print(f"Warning: unable to parse trending feed ({exc})")
        return []

    topics: List[Dict[str, str]] = []
    for item in root.findall(".//item"):
        title = (item.findtext("title") or "").strip()
        description = (item.findtext("description") or "").strip()
        if not title:
            continue
        combined = f"{title} {description}".strip()
        category = categorize_topic(combined)
        topics.append({"title": title, "category": category})
        if len(topics) >= limit:
            break
    return topics


def build_trend_context(topics: Iterable[Dict[str, str]]) -> str:
    lines = [f"- {item['title']} (category: {item['category']})" for item in topics]
    return "\n".join(lines)


def diversify_topics(
    ideas: List[TopicIdea],
    plan_count: int,
    trends: Optional[List[Dict[str, str]]] = None,
    min_categories: int = 4,
    max_per_category: int = 2,
) -> List[TopicIdea]:
    """
    Apply hard caps per category and backfill with trending items so daily runs
    are not dominated by a single domain (e.g., finance).
    """
    selected: List[TopicIdea] = []
    category_counts: Dict[str, int] = {}
    seen_slugs: set[str] = set()

    def consider(raw: TopicIdea) -> None:
        if len(selected) >= plan_count:
            return
        category = raw.category or categorize_topic(raw.prompt)
        if category_counts.get(category, 0) >= max_per_category:
            return
        slug = sanitize_slug(raw.slug)
        if slug in seen_slugs:
            return
        seen_slugs.add(slug)
        category_counts[category] = category_counts.get(category, 0) + 1
        selected.append(TopicIdea(slug=slug, prompt=raw.prompt, category=category, source=raw.source))

    for idea in ideas:
        consider(idea)
        if len(selected) >= plan_count:
            break

    if trends:
        # First, add categories we do not yet have to reach diversity minimum.
        for item in trends:
            if len(selected) >= plan_count:
                break
            if len(category_counts) >= min_categories and min_categories > 0:
                break
            category = item.get("category") or categorize_topic(item.get("title", ""))
            if category in category_counts:
                continue
            slug = sanitize_slug(item.get("title", "trend-topic"))
            prompt = f"{item.get('title', 'Trending topic')} calculator inspired by current news"
            consider(TopicIdea(slug=slug, prompt=prompt, category=category, source="trend"))

        # If we still have capacity, fill remaining slots with other trending items respecting caps.
        for item in trends:
            if len(selected) >= plan_count:
                break
            category = item.get("category") or categorize_topic(item.get("title", ""))
            slug = sanitize_slug(item.get("title", "trend-topic"))
            prompt = f"{item.get('title', 'Trending topic')} calculator inspired by current news"
            consider(TopicIdea(slug=slug, prompt=prompt, category=category, source="trend"))

    # If we are still short because of strict caps, allow existing categories up to the plan_count.
    if len(selected) < plan_count:
        overflow: List[TopicIdea] = []
        for idea in ideas:
            slug = sanitize_slug(idea.slug)
            if slug in seen_slugs:
                continue
            overflow.append(
                TopicIdea(
                    slug=slug,
                    prompt=idea.prompt,
                    category=idea.category or categorize_topic(idea.prompt),
                    source=idea.source,
                )
            )
        for idea in overflow:
            if len(selected) >= plan_count:
                break
            selected.append(idea)
            seen_slugs.add(idea.slug)

    return selected[:plan_count]


def load_recent_slugs(days: int = 14) -> set[str]:
    if not LOG_FILE.exists():
        return set()
    cutoff = datetime.utcnow() - timedelta(days=days)
    recent: set[str] = set()
    with LOG_FILE.open("r", encoding="utf-8") as fh:
        header_skipped = False
        for line in fh:
            if not header_skipped:
                header_skipped = True
                if line.lower().startswith("timestamp_utc"):
                    continue
            parts = line.strip().split(",")
            if len(parts) < 2:
                continue
            timestamp_raw, slug = parts[0], parts[1]
            ts_clean = timestamp_raw.rstrip("Z")
            dt: datetime | None = None
            for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"):
                try:
                    dt = datetime.strptime(ts_clean, fmt)
                    break
                except ValueError:
                    continue
            if not dt:
                try:
                    dt = datetime.fromisoformat(ts_clean)
                except ValueError:
                    continue
            if dt >= cutoff:
                recent.add(slug)
    return recent


# ---------- Content generation ----------
def plan_topics_with_gemini(
    api_key: str,
    plan_count: int,
    niches: str,
    trends: Optional[List[Dict[str, str]]] = None,
    recent_slugs: Optional[set[str]] = None,
) -> List[TopicIdea]:
    if not HAS_GENAI:
        return []
    genai.configure(api_key=api_key)
    trend_context = build_trend_context((trends or [])[:12]) if trends else ""
    avoid_list = sorted(list(recent_slugs))[:20] if recent_slugs else []
    avoid_text = ", ".join(avoid_list)
    trend_clause = (
        "Trending research observed today (use as inspiration, do not simply repeat headlines):\n"
        f"{trend_context}\n"
        "Ensure you cover at least four distinct categories across climate, health, construction, energy, lifestyle, tech, education, and finance."
        if trend_context
        else ""
    )
    avoid_clause = f"Avoid slugs already built recently: {avoid_text}." if avoid_text else ""
    prompt = f"""You are an editor planning tomorrow's batch of niche calculator tools.
Preferred niches to lean on: {niches}.
{trend_clause}
{avoid_clause}

Return ONLY a JSON array of {plan_count} objects. Each object must contain:
- slug: URL-friendly string
- title: human-friendly calculator idea name
- category: one of finance, health, climate, energy, construction, technology, education, lifestyle, sports, general
- inspiration: short phrase explaining how this relates to the trending topic or evergreen demand
- summary: one sentence describing the calculation focus

Constraints:
- No more than two ideas per category.
- Include at least one non-finance idea.
- Each calculator must be formula-heavy (multi-step logic, not a single multiplication).
- JSON only, no commentary."""
    model = genai.GenerativeModel(MODEL_NAME)
    try:
        response = model.generate_content(prompt, request_options={"timeout": 60})
    except Exception as e:
        print("Strategy generation failed:", e)
        return []
    text = response.text or "[]"
    try:
        cleaned = re.sub(r"```json\s*", "", text, flags=re.IGNORECASE)
        cleaned = re.sub(r"```", "", cleaned)
        topics = json.loads(cleaned)
        if not isinstance(topics, list):
            raise ValueError("Plan result is not a list")
        ideas: List[TopicIdea] = []
        for raw in topics:
            if isinstance(raw, str):
                slug = sanitize_slug(raw)
                ideas.append(TopicIdea(slug=slug, prompt=raw))
                continue
            if isinstance(raw, dict):
                slug_source = raw.get("slug") or raw.get("title") or raw.get("idea") or raw.get("topic")
                if not slug_source:
                    continue
                slug = sanitize_slug(slug_source)
                title = raw.get("title") or slug_source
                category = raw.get("category") or raw.get("domain")
                inspiration = raw.get("inspiration") or raw.get("trend")
                summary = raw.get("summary") or raw.get("details")
                prompt_parts = [title]
                if category:
                    prompt_parts.append(f"Category: {category}")
                if inspiration:
                    prompt_parts.append(f"Inspired by: {inspiration}")
                if summary:
                    prompt_parts.append(summary)
                prompt_text = " | ".join(prompt_parts)
                ideas.append(TopicIdea(slug=slug, prompt=prompt_text, category=category, source=inspiration))
        return ideas[:plan_count]
    except Exception:
        # fallback: extract bullet/line items
        lines = [
            TopicIdea(slug=sanitize_slug(m.group(1)), prompt=m.group(1))
            for m in re.finditer(r"^[\-\*\d\.\)]\s*(.+)$", text, flags=re.MULTILINE)
            if m.group(1)
        ]
        if lines:
            return lines[:plan_count]
        print("Warning: could not parse strategy plan JSON, got:", text[:200])
    return []


def generate_with_gemini(topic: str, api_key: str) -> ToolConfig | None:
    if not HAS_GENAI:
        return None
    genai.configure(api_key=api_key)
    prompt = f"""You are generating a high-quality, professional JSON config for a calculator about "{topic}".
Return only valid JSON with fields: slug, title, seo{{title,description}}, summary,
inputs[id,label,type(number|text),placeholder,required,step?],
outputs[id,label,unit?,precision?],
formula (JavaScript body returning an object), cta,
faq(list of {{q,a}} 5-8 items), tags(list of strings),
    related(slugs of similar tools), article(list of sections with heading, body),
    calculationSteps(list of strings describing the math).

Constraints for "High Value Content":
- inputs: 4-10 professional inputs. Use realistic domain units and granular steps.
- formula: Must be a robust, multi-step calculation. Include edge case handling, caps, and logical branches.
- calculationSteps: 3-6 clear, numbered steps explaining how the inputs become the outputs.
- article: At least 1000 words of high-quality, original-sounding content. Avoid generic filler.
  Sections required:
  1) "The Importance of {topic} in Modern Context" (Deep dive into the 'why')
  2) "In-Depth Technical Guide: How the Calculation Works" (Explain the math/logic clearly)
  3) "Real-World Application Scenarios" (Describe 2-3 detailed personas or situations where this tool is used)
  4) "Advanced Considerations and Potential Pitfalls" (Professional advice on limitations)
- FAQ: 8 unique, high-quality questions and answers that address user intent.
- Slug: URL-safe, lowercase.

Respond with JSON only, ensuring the content feels written by an expert in the field."""
    model = genai.GenerativeModel(MODEL_NAME)
    try:
        response = model.generate_content(prompt, request_options={"timeout": 120})
    except Exception as e:
        print(f"❌ Generation failed for {topic}:", e)
        return None
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
def iter_topics_from_file(path: Path) -> Iterable[TopicIdea]:
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            topic = line.strip()
            if topic:
                yield TopicIdea(slug=sanitize_slug(topic), prompt=topic)


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Generate tool JSON configs.")
    parser.add_argument("--topic", help="Single domain or calculator idea.")
    parser.add_argument("--topics-file", type=Path, help="Path to a file with one topic per line.")
    parser.add_argument("--max-per-day", type=int, default=10, help="Max items to generate.")
    parser.add_argument("--log", action="store_true", help="Append CSV log.")
    parser.add_argument("--shuffle", action="store_true", help="Shuffle topics.")
    parser.add_argument("--strategy", action="store_true", help="Use strategy planning via Gemini.")
    parser.add_argument(
        "--use-trending",
        action="store_true",
        help="Fetch trending topics online and force diverse domains for strategy mode.",
    )
    parser.add_argument("--plan-count", type=int, default=10, help="Topics to request in strategy.")
    parser.add_argument(
        "--niches",
        type=str,
        default="health, climate, construction, energy, education, technology, lifestyle, sports, finance",
        help="Comma-separated niches (broad by default to avoid finance-only runs).",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite existing file if exists.")
    parser.add_argument("--mock", action="store_true", help="Force mock mode (no API calls).")
    parser.add_argument("--slug", help="Optional slug override for single topic.")
    args = parser.parse_args(argv)

    if not args.topic and not args.topics_file and not args.strategy:
        parser.error("Provide --topic or --topics-file or --strategy")

    plan_target = min(args.plan_count, args.max_per_day)
    topics: List[TopicIdea] = []
    api_key = GEMINI_API_KEY
    use_mock = args.mock or not (api_key and HAS_GENAI)
    recent_slugs = load_recent_slugs()
    trend_data: List[Dict[str, str]] = []
    if args.use_trending:
        trend_limit = max(args.plan_count * 2, 10)
        trend_data = fetch_trending_topics(limit=trend_limit)

    if args.strategy and not use_mock:
        topics = plan_topics_with_gemini(
            api_key,
            args.plan_count,
            args.niches,
            trends=trend_data or None,
            recent_slugs=recent_slugs or None,
        )
        if args.shuffle:
            random.shuffle(topics)
        if topics:
            topics = diversify_topics(
                topics,
                plan_count=plan_target,
                trends=trend_data or None,
                min_categories=5 if trend_data else 4,
                max_per_category=2,
            )
        if not topics:
            print("Strategy returned no topics; falling back to topics file or single topic.")
    if not topics and args.topics_file:
        topics = list(iter_topics_from_file(args.topics_file))
        if args.shuffle:
            random.shuffle(topics)
    if not topics:
        # env TOPICS_FILE fallback
        env_topics = os.environ.get("TOPICS_FILE")
        if env_topics and Path(env_topics).exists():
            topics = list(iter_topics_from_file(Path(env_topics)))
            if args.shuffle:
                random.shuffle(topics)
    if not topics and args.topic:
        topics = [TopicIdea(slug=sanitize_slug(args.topic), prompt=args.topic)]
    if not topics and trend_data:
        trending_ideas = [
            TopicIdea(
                slug=sanitize_slug(item["title"]),
                prompt=f"{item['title']} calculator inspired by breaking news",
                category=item.get("category"),
            )
            for item in trend_data
        ]
        topics = diversify_topics(
            trending_ideas,
            plan_count=plan_target,
            trends=trend_data or None,
            min_categories=5,
            max_per_category=2,
        )

    generated = 0
    for topic in topics:
        if generated >= args.max_per_day:
            print(f"Reached daily cap ({args.max_per_day}), stopping.")
            break
        slug = sanitize_slug(args.slug or topic.slug)
        tool: ToolConfig | None = None
        if not use_mock:
            try:
                tool = generate_with_gemini(topic.prompt, api_key)  # type: ignore[arg-type]
            except Exception as e:
                print(f"❌ Error on {topic.prompt}: {e}")
                tool = None
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
