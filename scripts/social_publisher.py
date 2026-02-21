
import os
import re
import time
import argparse
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Configuration ---
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT", "CalcPandaPublisher/1.0")
REDDIT_USERNAME = os.getenv("REDDIT_USERNAME")
REDDIT_PASSWORD = os.getenv("REDDIT_PASSWORD")
REDDIT_SUBREDDIT = os.getenv("REDDIT_SUBREDDIT", "u_{}".format(REDDIT_USERNAME) if REDDIT_USERNAME else "test")

MEDIUM_INTEGRATION_TOKEN = os.getenv("MEDIUM_INTEGRATION_TOKEN")
MEDIUM_AUTHOR_ID = os.getenv("MEDIUM_AUTHOR_ID") # Optional, fetched if None

MARKETING_DIR = Path(__file__).resolve().parents[1] / "app" / "data" / "marketing"

# --- Platform Handlers ---

def post_to_reddit(content_block, dry_run=False):
    """
    Publishes content to Reddit. 
    Expects content_block to have a line starting with **Title:**
    """
    print(f"  [Reddit] Identifying content...")
    
    # Simple parsing strategy
    lines = content_block.strip().split('\n')
    title = ""
    body_lines = []
    
    for line in lines:
        if line.lower().startswith("**title:**"):
            title = line.split(":", 1)[1].strip()
        else:
            body_lines.append(line)
            
    body = "\n".join(body_lines).strip()
    
    if not title:
        print("  [Reddit] Error: No '**Title:**' found in draft.")
        return False

    if dry_run:
        print(f"  [Reddit] [DRY RUN] Would post to r/{REDDIT_SUBREDDIT}:")
        print(f"    Title: {title}")
        print(f"    Body Length: {len(body)} chars")
        return True

    if not all([REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD]):
        print("  [Reddit] Error: Missing credentials in .env")
        return False

    try:
        import praw
        reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT,
            username=REDDIT_USERNAME,
            password=REDDIT_PASSWORD
        )
        # Authentication check
        print(f"  [Reddit] Authenticated as {reddit.user.me()}")
        
        subreddit = reddit.subreddit(REDDIT_SUBREDDIT)
        submission = subreddit.submit(title, selftext=body)
        print(f"  [Reddit] Success! URL: {submission.url}")
        return True
    except ImportError:
        print("  [Reddit] Error: 'praw' library not installed. Run 'pip install praw'")
    except Exception as e:
        print(f"  [Reddit] Error: {e}")
    return False

def post_to_medium(content_block, dry_run=False):
    """
    Publishes content to Medium.
    Expects markdown content. First H1 (# Title) is used as title.
    """
    print(f"  [Medium] Identifying content...")
    
    lines = content_block.strip().split('\n')
    title = "New Post"
    processed_lines = []
    
    # Extract Title from first H1
    found_title = False
    for line in lines:
        if not found_title and line.startswith("# "):
            title = line[2:].strip()
            found_title = True
        else:
            processed_lines.append(line)
            
    content = "\n".join(processed_lines).strip()
    content_format = "markdown"

    if dry_run:
        print(f"  [Medium] [DRY RUN] Would post:")
        print(f"    Title: {title}")
        print(f"    Body Length: {len(content)} chars")
        return True
        
    if not MEDIUM_INTEGRATION_TOKEN:
         print("  [Medium] Error: MEDIUM_INTEGRATION_TOKEN not set.")
         return False

    headers = {
        "Authorization": f"Bearer {MEDIUM_INTEGRATION_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        # 1. Get User ID if not provided
        author_id = MEDIUM_AUTHOR_ID
        if not author_id:
            user_resp = requests.get("https://api.medium.com/v1/me", headers=headers)
            user_resp.raise_for_status()
            author_id = user_resp.json()['data']['id']
            print(f"  [Medium] Authenticated as {user_resp.json()['data']['username']}")

        # 2. Post
        url = f"https://api.medium.com/v1/users/{author_id}/posts"
        data = {
            "title": title,
            "contentFormat": content_format,
            "content": content,
            "publishStatus": "draft", # Safety first
            "notifyFollowers": False
        }
        
        resp = requests.post(url, headers=headers, json=data)
        resp.raise_for_status()
        post_data = resp.json()['data']
        print(f"  [Medium] Success! content posted as draft. URL: {post_data['url']}")
        return True

    except Exception as e:
        print(f"  [Medium] Error: {e}")
        if 'resp' in locals():
            print(resp.text)
    return False

# --- Main Logic ---

def parse_markdown_file(filepath):
    """
    Splits the generated markdown seed file into per-platform chunks.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        
    sections = {}
    # Regex to find "## Platform Draft" sections
    # Matches "## Reddit Draft" until the next "## " or end of string
    platforms = ["Reddit", "Medium", "Quora", "Twitter"]
    
    for p in platforms:
        pattern = re.compile(f"## {p} Draft\n(.*?)(?=\n## |\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            sections[p] = match.group(1).strip()
            
    return sections

def main():
    parser = argparse.ArgumentParser(description="Automated Social Media Publisher")
    parser.add_argument("slug", help="Tool slug (e.g., loan-amortization-calculator)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without posting")
    parser.add_argument("--platform", choices=["all", "reddit", "medium"], default="all", help="Specific platform to post to")
    
    args = parser.parse_args()
    
    # Locate file
    filename = f"{args.slug}-seed.md"
    filepath = MARKETING_DIR / filename
    
    if not filepath.exists():
        print(f"Error: Marketing file not found at {filepath}")
        print(f"Run 'python scripts/generate_social_seed.py {args.slug}' first.")
        return

    print(f"--- Processing {args.slug} ---")
    sections = parse_markdown_file(filepath)
    
    # Reddit
    if args.platform in ["all", "reddit"]:
        if "Reddit" in sections:
            post_to_reddit(sections["Reddit"], dry_run=args.dry_run)
            time.sleep(2) # Rate limit safety
        else:
            print("  [Reddit] No draft found in file.")

    # Medium
    if args.platform in ["all", "medium"]:
        if "Medium" in sections:
            post_to_medium(sections["Medium"], dry_run=args.dry_run)
            time.sleep(2)
        else:
            print("  [Medium] No draft found in file.")
            
    # Note on others
    if args.platform == "all":
        print(f"  [Info] Quora and Twitter drafts are generated but require manual posting (APIs expensive/complex).")

if __name__ == "__main__":
    main()
