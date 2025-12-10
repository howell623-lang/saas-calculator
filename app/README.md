## Micro SaaS Factory (JSON-driven calculators)

Next.js (App Router) + Tailwind UI that renders calculators entirely from JSON specs. Drop new configs into `data/tools` and the site auto-renders routes, metadata, and sitemap entries. A Python helper script can mint new tools (mock mode included).

### Quickstart

```bash
npm run dev
```

- Home: lists all tools found in `data/tools/*.json`.
- Tool page: `/{slug}` renders inputs, runs the JSON-provided formula, shows outputs, FAQ, tags, and an ad placeholder.
- SEO: `sitemap.ts` and `robots.ts` pull from the same JSON source.
- Ads: `AdSlot` respects a global ads toggle (`AdsToggle`), so you can simulate subscriber “no-ads” mode.

### JSON schema (minimal)

```jsonc
{
  "slug": "fish-tank-salinity",
  "title": "Fish Tank Salinity Calculator",
  "seo": { "title": "...", "description": "..." },
  "summary": "Optional short blurb.",
  "inputs": [{ "id": "volume", "label": "Volume", "type": "number", "required": true }],
  "formula": "const result = volume * 2; return { result };",
  "outputs": [{ "id": "result", "label": "Result", "unit": "g", "precision": 1 }],
  "cta": "Calculate",
  "faq": [{ "q": "Question?", "a": "Answer." }],
  "tags": ["tag-a", "tag-b"]
}
```

### Python generator (mock mode by default)

```bash
python scripts/generate_tools.py --topic "aquarium salinity" --mock
# set GEMINI_API_KEY and drop --mock to use Gemini (requires google-generativeai)
```

Flags: `--slug` to override slug, `--force` to overwrite existing files. `--use-trending` hits the Google News RSS feed (or `TRENDING_FEED_URL`) to seed hot topics, forcing Gemini to rotate into new domains. Install `requests` (in addition to `google-generativeai`) for the trending fetch.

### Daily automation

- Topics seed: `scripts/topics.txt` (one topic per line). Strategy mode can auto-plan topics via Gemini, and `--use-trending` keeps the daily batch aligned with whatever is spiking online.
- One-command daily run (requires `GEMINI_API_KEY`): `npm run generate:daily` (defaults to strategy, 20 per day)
- Mock demo (10 items): `npm run generate:mock`
- Daily cap/logging: controlled via `scripts/run_daily.sh` (env `MAX_PER_DAY`, `TOPICS_FILE`, `MOCK=true/false`), uses `--shuffle` by default.
- Log file: `data/tool_generation_log.csv` keeps timestamp/slug/title/path and is used to avoid repeating recent slugs when planning.

GitHub Actions (optional):
- Workflow: `.github/workflows/daily-generate.yml`
- Set `GEMINI_API_KEY` secret; action runs daily 02:00 UTC, writes new tools, commits/pushes if changed.

### Deployment notes

- Set `NEXT_PUBLIC_SITE_URL` (or `SITE_URL`) for correct sitemap links.
- AdSense: `AdSlot` already embeds AdSense with the provided client/slot and respects the ads toggle.
- Commit and push to Vercel; new JSON files become new routes automatically.
