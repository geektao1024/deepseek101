#!/bin/bash

# 此脚本用于从各类别文件中提取工具信息并更新tools.json文件
# 注意：需要安装jq工具

# 检查jq是否安装
if ! command -v jq &> /dev/null; then
  echo "错误: 此脚本需要jq工具，请先安装jq"
  echo "安装命令: brew install jq (MacOS) 或 apt-get install jq (Linux)"
  exit 1
fi

# 主数据目录
DATA_DIR="data/json"
TOOLS_FILE="${DATA_DIR}/tools.json"
CATEGORIES_DIR="${DATA_DIR}/categories"

# 临时文件
TEMP_FILE="${DATA_DIR}/temp_tools.json"
ALL_TOOLS_TEMP="${DATA_DIR}/all_tools_temp.json"

# 初始化空的工具数组
echo "[]" > "$ALL_TOOLS_TEMP"

# 遍历所有类别文件
echo "正在从类别文件中提取工具信息..."
for category_file in "${CATEGORIES_DIR}"/*.json; do
  # 跳过index.json
  if [[ "$(basename "$category_file")" == "index.json" ]]; then
    continue
  fi
  
  # 提取类别ID
  category_id=$(jq -r '.id' "$category_file")
  echo "处理类别: $category_id"
  
  # 提取该类别下的所有工具并添加到临时文件
  jq --arg cat "$category_id" '.tools[] | . + {category: $cat}' "$category_file" > "${DATA_DIR}/temp_cat_tools.json"
  
  # 将提取的工具添加到总工具列表中
  if [ -s "${DATA_DIR}/temp_cat_tools.json" ]; then
    jq -s '.[0] + .[1][]' "$ALL_TOOLS_TEMP" "${DATA_DIR}/temp_cat_tools.json" > "${DATA_DIR}/temp_merge.json"
    mv "${DATA_DIR}/temp_merge.json" "$ALL_TOOLS_TEMP"
  fi
  
  # 删除类别临时文件
  rm -f "${DATA_DIR}/temp_cat_tools.json"
done

# 更新tools.json文件，保留categories部分并添加新的tools数组
jq --slurpfile tools "$ALL_TOOLS_TEMP" '. + {tools: $tools[0]}' "$TOOLS_FILE" > "$TEMP_FILE"
mv "$TEMP_FILE" "$TOOLS_FILE"

# 删除临时文件
rm -f "$ALL_TOOLS_TEMP"

echo "完成! 已从类别文件中提取工具信息并更新tools.json文件"
echo "工具总数: $(jq '.tools | length' "$TOOLS_FILE")" 