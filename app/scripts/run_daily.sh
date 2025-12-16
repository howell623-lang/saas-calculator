#!/bin/bash
set -e
cd "$(dirname "$0")/.."
echo "🚀 Starting Daily Tool Generation..."

PYTHON_BIN="${PYTHON_BIN:-python3}"
MAX_PER_DAY="${MAX_PER_DAY:-10}"
PLAN_COUNT="${PLAN_COUNT:-10}"
NICHES="${NICHES:-health, climate, construction, energy, education, technology, lifestyle, sports, finance}"
TOPICS_FILE="${TOPICS_FILE:-scripts/topics.txt}"

"${PYTHON_BIN}" scripts/generate_tools.py \
  --strategy \
  --use-trending \
  --plan-count "${PLAN_COUNT}" \
  --max-per-day "${MAX_PER_DAY}" \
  --niches "${NICHES}" \
  --topics-file "${TOPICS_FILE}" \
  --log \
  --shuffle
