#!/bin/bash
# 快速启动脚本

echo "🚀 启动 Web Worker 大数据表格优化 Demo"
echo ""

# 检查是否安装了 Python
if command -v python3 &> /dev/null; then
    echo "📂 项目路径: $(pwd)"
    echo "🌐 启动 HTTP 服务器: http://localhost:8000"
    echo ""
    echo "💡 按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "📂 项目路径: $(pwd)"
    echo "🌐 启动 HTTP 服务器: http://localhost:8000"
    echo ""
    echo "💡 按 Ctrl+C 停止服务器"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "❌ 未找到 Python 环境"
    echo ""
    echo "请手动启动 HTTP 服务器:"
    echo ""
    echo "  Python 3: python3 -m http.server 8000"
    echo "  Python 2: python -m SimpleHTTPServer 8000"
    echo "  Node.js: npx http-server"
    exit 1
fi
