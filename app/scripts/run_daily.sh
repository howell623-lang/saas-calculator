#!/bin/bash
cd "$(dirname "$0")/.."
echo "🚀 Starting Daily Tool Generation..."
# 不传任何参数，避免报错
python3 scripts/generate_tools.py
