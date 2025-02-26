#!/bin/bash

# 更新应用类别下所有工具详情文件的category字段
for file in data/json/tools/details/applications/*.json; do
  # 检查是否安装了jq
  if command -v jq &> /dev/null; then
    # 使用jq修改category字段值为applications
    jq '.category = "applications"' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    echo "使用jq更新文件: $file"
  else
    # 如果没有jq，使用sed命令替代（不太可靠，但在简单情况下可用）
    if grep -q '"category":' "$file"; then
      # 如果存在category字段，更新它
      sed -i '' 's/"category":[[:space:]]*"[^"]*"/"category": "applications"/g' "$file"
    else
      # 如果不存在category字段，在id字段后添加
      sed -i '' '/"id":/a\\  "category": "applications",' "$file"
    fi
    echo "使用sed更新文件: $file"
  fi
done

echo "完成更新" 