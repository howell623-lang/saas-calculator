#!/bin/bash
set -e
cd "$(dirname "$0")/.."
echo "🚀 Starting Daily Tool Generation..."

PYTHON_BIN="${PYTHON_BIN:-python3}"
MAX_PER_DAY="${MAX_PER_DAY:-10}"
PLAN_COUNT="${PLAN_COUNT:-10}"
NICHES="${NICHES:-gardening, finance, health}"

"${PYTHON_BIN}" scripts/generate_tools.py \
  --strategy \
  --plan-count "${PLAN_COUNT}" \
  --max-per-day "${MAX_PER_DAY}" \
  --niches "${NICHES}" \
  --topics-file "${TOPICS_FILE}" \
  --log \
  --shuffle
TOPICS_FILE="${TOPICS_FILE:-scripts/topics.txt}"
