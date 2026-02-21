
import os
import json
import argparse
from pathlib import Path
import google.generativeai as genai

# Setup
ROOT = Path(__file__).resolve().parents[1]
TOOLS_DIR = ROOT / "app" / "data" / "tools"
MARKETING_DIR = ROOT / "app" / "data" / "marketing"
MARKETING_DIR.mkdir(parents=True, exist_ok=True)

MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
API_KEY = os.environ.get("GEMINI_API_KEY")

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

import google.generativeai as genai

def load_tool(slug):
    path = TOOLS_DIR / f"{slug}.json"
    if not path.exists():
         print(f"Tool not found: {slug}")
         return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def generate_social_content(tool, platform):
    prompt_base = f"""
    You are an expert content marketer. Create a comprehensive "{platform}" post for a free online tool called "{tool['title']}".
    
    Tool Context:
    - Summary: {tool.get('summary', '')}
    - Key Inputs: {[i['label'] for i in tool.get('inputs', [])]}
    - Key Outputs: {[o['label'] for o in tool.get('outputs', [])]}
    
    Constraints for {platform}:
    """
    
    if platform == "Reddit":
        prompt = prompt_base + """
        - Context: A relevant subreddit (e.g., r/dataisbeautiful, r/personalfinance, r/fitness).
        - Style: "I built this." Humble, authentic, engineering-focused. Avoid excessive emojis or "salesy" language.
        - Structure:
          1. The Problem: Why existing calculators suck (ads, poor accuracy, no privacy).
          2. The Solution: How this tool assumes/calculates differently (mention the formula/logic).
          3. "I made it free and privacy-focused (local calculation)."
          4. Ask for feedback.
        - formatting: Markdown.
        """
    elif platform == "Quora":
        prompt = prompt_base + """
        - Context: Answering a question like "How do I calculate [Tool Topic]?"
        - Style: Educational, helpful, authoritative.
        - Structure:
          1. Direct Answer: Explain the math concepts (e.g., define the variables).
          2. The Formula: Show the actual formula from the content.
          3. Manual Calculation Example: Walk through a dummy example.
          4. "To save time, I built a calculator that does this automatically: [Link Placeholder]"
        - formatting: Markdown.
        """
    elif platform == "Twitter":
        prompt = prompt_base + """
        - Context: A viral thread (5-7 tweets).
        - Style: Punchy, data-driven, "Did you know?".
        - Structure:
          - Tweet 1: Hook (Surprising fact about this topic).
          - Tweet 2-4: educational nuggets or common misconceptions.
          - Tweet 5: "I built a tool to solve this."
          - Tweet 6: Link.
        - formatting: Plain text with tweet numbering (1/6).
        """
    elif platform == "Medium":
        prompt = prompt_base + """
        - Context: A "Deep Dive" blog post draft.
        - Style: Storytelling + Technical.
        - Structure:
          - Engaging Title.
          - Intro: The complexity of this problem.
          - Technical Deep Dive: Explaining the variables.
          - How our tool solves it.
        - Length: ~600 words.
        - formatting: Markdown.
        """
        
    model = genai.GenerativeModel(MODEL_NAME)
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating {platform} content: {str(e)}"

# ---------- Template Fallback ----------
def generate_template_content(tool, platform):
    title = tool.get('title', 'Calculator')
    summary = tool.get('summary', 'A useful tool.')
    slug = tool.get('slug', '')
    url = f"https://calcpanda.com/{slug}"
    
    if platform == "Reddit":
        return f"""**Title:** I built a free, privacy-focused {title} (no ads, local calculation)

Hey r/selfhosted (and others),

I found that most {title}s online are riddled with ads or send your data to a backend server. I wanted something cleaner and faster, so I built my own.

**What it does:**
{summary}

**How it works:**
It runs entirely in your browser using standardized formulas. No data leaves your device.

**Link:**
[{title}]({url})

I'd love to hear your feedback on the UX or if I missed any edge cases!"""

    elif platform == "Quora":
        faq = tool.get('faq', [])
        faq_content = faq[0]['a'] if faq else "It uses standard industry formulas."
        return f"""**Question:** What is the best way to calculate {title}?

**Answer:**

Calculating this accurately requires understanding a few key variables. 

{summary}

The core logic usually involves these factors:
{', '.join([i['label'] for i in tool.get('inputs', [])[:3]])}

Strictly speaking, the formula often looks like this:
> (Refer to standard engineering/financial models)

However, doing this manually is prone to error.

I built a free tool called **{title}** that automates this:
{url}

It processes everything locally in your browser for privacy.

*Disclaimer: I am the developer of CalcPanda.*"""

    elif platform == "Twitter":
        return f"""1/5 🧵 Struggling with {title}?
        
Most people guess, but precision matters.

2/5 🤓 The math seemingly is simple, but edge cases kill you. 
{summary}

3/5 💡 Did you know?
Most online tools track your data. 

4/5 🛠️ That's why I built a privacy-first version.
Runs 100% in your browser. No ads. No tracking.

5/5 🔗 Try it here:
{url}

#buildinpublic #tool #calculator"""

    elif platform == "Medium":
         return f"""# The Definitive Guide to {title}

In a world driven by data, making guesses is a recipe for failure. Whether you are planning your finances or engineering a structure, precision is key.

## Why This Matters
{summary}

## The Mathematical Challenge
Most people underestimate the complexity of getting this right. You need to account for:
* {tool.get('inputs', [{'label': 'Various inputs'}])[0]['label']}
* Unit conversions
* Edge cases

## A Better Solution
I grew frustrated with ad-heavy, slow calculators. So I built **{title}**.

It is designed to be:
1.  **Fast**: Loads instantly.
2.  **Private**: Everything calculates in your browser.
3.  **Transparent**: We explain the math.

## Try It Out
You can use the tool for free here: [{title}]({url})

Let me know what you think in the comments!
"""
    return "Unknown platform"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("slug", help="Tool slug to generate content for")
    args = parser.parse_args()
    
    # Configure GenAI if key exists
    use_ai = False
    if API_KEY:
        try:
            genai.configure(api_key=API_KEY)
            use_ai = True
        except:
            pass
    
    tool = load_tool(args.slug)
    if not tool:
        return

    print(f"Generating seeding content for: {tool['title']} (AI Mode: {use_ai})...")
    
    output_path = MARKETING_DIR / f"{args.slug}-seed.md"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Seeding Content for {tool['title']}\n\n")
        f.write(f"Target URL: https://calcpanda.com/{tool['slug']}\n\n")
        
        for platform in ["Reddit", "Quora", "Twitter", "Medium"]:
            print(f"  - Generating {platform}...")
            if use_ai:
                content = generate_social_content(tool, platform)
            else:
                content = generate_template_content(tool, platform)
                
            f.write(f"## {platform} Draft\n\n")
            f.write(content)
            f.write("\n\n---\n\n")
            
    print(f"Done! Saved to {output_path}")

if __name__ == "__main__":
    main()
