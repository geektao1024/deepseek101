#!/bin/bash

# 此脚本用于为所有类别创建空的JSON文件框架

# 类别列表
CATEGORIES=(
  "ai-frameworks"
  "rag-frameworks"
  "browser-extensions"
  "vscode-extensions"
  "others"
)

# 基本的空类别文件模板
TEMPLATE='{
  "id": "%s",
  "name": "%s",
  "description": "%s",
  "icon": "%s",
  "tools": [],
  "version": "1.0.0",
  "last_updated": "2024-02-25"
}'

# 类别名称和描述
declare -A NAMES
NAMES=(
  ["ai-frameworks"]="AI Frameworks"
  ["rag-frameworks"]="RAG Frameworks"
  ["browser-extensions"]="Browser Extensions"
  ["vscode-extensions"]="VSCode Extensions"
  ["others"]="Others"
)

declare -A DESCRIPTIONS
DESCRIPTIONS=(
  ["ai-frameworks"]="人工智能框架和库"
  ["rag-frameworks"]="检索增强生成（RAG）框架"
  ["browser-extensions"]="浏览器扩展和插件"
  ["vscode-extensions"]="Visual Studio Code 扩展"
  ["others"]="其他工具和资源"
)

declare -A ICONS
ICONS=(
  ["ai-frameworks"]="framework"
  ["rag-frameworks"]="rag"
  ["browser-extensions"]="browser"
  ["vscode-extensions"]="vscode"
  ["others"]="other"
)

# 为每个类别创建文件
for category in "${CATEGORIES[@]}"; do
  file_path="data/json/categories/${category}.json"
  name="${NAMES[$category]}"
  description="${DESCRIPTIONS[$category]}"
  icon="${ICONS[$category]}"
  
  # 使用printf格式化JSON模板
  printf "$TEMPLATE" "$category" "$name" "$description" "$icon" > "$file_path"
  
  echo "创建文件: $file_path"
done

echo "完成创建所有类别文件" 