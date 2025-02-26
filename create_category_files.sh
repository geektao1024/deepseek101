#!/bin/bash

# 创建其余的类别文件

# 确保目录存在
mkdir -p data/json/categories

# 定义函数来创建类别文件
create_category_file() {
  local id=$1
  local name=$2
  local description=$3
  local icon=$4
  local file_path="data/json/categories/${id}.json"
  
  # 如果文件已存在，则跳过
  if [ -f "$file_path" ]; then
    echo "跳过已存在的文件: $file_path"
    return
  fi
  
  # 创建JSON内容
  cat > "$file_path" << EOF
{
  "id": "${id}",
  "name": "${name}",
  "description": "${description}",
  "icon": "${icon}",
  "tools": [],
  "version": "1.0.0",
  "last_updated": "2024-11-18"
}
EOF
  
  echo "已创建: $file_path"
}

# 创建剩余的类别文件
create_category_file "solana-frameworks" "Solana Frameworks" "Solana 开发框架" "code"
create_category_file "synthetic-data" "Synthetic Data" "合成数据工具" "data"
create_category_file "im-plugins" "IM Application Plugins" "即时通讯应用插件" "message-square"
create_category_file "curation" "Curation" "内容策划工具" "list"
create_category_file "visual-studio-extensions" "Visual Studio Extensions" "Visual Studio 扩展" "code"
create_category_file "neovim-extensions" "Neovim Extensions" "Neovim 扩展" "terminal"
create_category_file "jetbrains-extensions" "JetBrains Extensions" "JetBrains IDE 扩展" "code"
create_category_file "discord-bots" "Discord Bots" "Discord 机器人" "bot"
create_category_file "ai-code-editor" "Native AI Code Editor" "原生 AI 代码编辑器" "edit"
create_category_file "emacs" "Emacs" "Emacs 工具和扩展" "terminal"
create_category_file "security" "Security" "安全工具" "shield"

echo "所有类别文件创建完成！" 