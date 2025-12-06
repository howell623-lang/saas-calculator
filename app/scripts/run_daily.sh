#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOPICS_FILE="${TOPICS_FILE:-$ROOT/scripts/topics.txt}"
MAX_PER_DAY="${MAX_PER_DAY:-50}"
MOCK="${MOCK:-false}"

cd "$ROOT"

MOCK_FLAG=""
if [[ "$MOCK" == "true" ]]; then
  MOCK_FLAG="--mock"
fi

PYTHON_BIN="${PYTHON_BIN:-python3}"

$PYTHON_BIN scripts/generate_tools.py \
  --topics-file "$TOPICS_FILE" \
  --max-per-day "$MAX_PER_DAY" \
  --log \
  --shuffle \
  $MOCK_FLAG
