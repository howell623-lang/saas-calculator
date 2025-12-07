#!/bin/bash
# 进入 app 目录
cd "$(dirname "$0")/.."

echo "🚀 Starting Daily Tool Generation..."
# 直接运行 Python 脚本，不传任何参数，避免报错
python3 scripts/generate_tools.py
