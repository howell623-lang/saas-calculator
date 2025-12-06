#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOPICS_FILE="${TOPICS_FILE:-$ROOT/scripts/topics.txt}"
MAX_PER_DAY="${MAX_PER_DAY:-20}"
MOCK="${MOCK:-false}"
STRATEGY="${STRATEGY:-true}"
PLAN_COUNT="${PLAN_COUNT:-20}"
NICHES="${NICHES:-gardening, finance, health}"

cd "$ROOT"

MOCK_FLAG=""
if [[ "$MOCK" == "true" ]]; then
  MOCK_FLAG="--mock"
fi

PYTHON_BIN="${PYTHON_BIN:-python3}"

if [[ "$STRATEGY" == "true" && -n "${GEMINI_API_KEY:-}" ]]; then
  $PYTHON_BIN scripts/generate_tools.py \
    --strategy \
    --plan-count "$PLAN_COUNT" \
    --max-per-day "$MAX_PER_DAY" \
    --log \
    --shuffle \
    --niches "$NICHES" \
    $MOCK_FLAG
else
  $PYTHON_BIN scripts/generate_tools.py \
    --topics-file "$TOPICS_FILE" \
    --max-per-day "$MAX_PER_DAY" \
    --log \
    --shuffle \
    $MOCK_FLAG
fi
