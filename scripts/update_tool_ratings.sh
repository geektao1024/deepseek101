#!/bin/bash
# 脚本名称: update_tool_ratings.sh
# 描述: 为所有工具生成随机评分和评分数量，以模拟用户评价
# 用法: ./update_tool_ratings.sh
# 作者: DeepSeek AI

# 设置目录路径
DATA_DIR="data/json"
TOOLS_FILE="${DATA_DIR}/tools.json"
CATEGORIES_DIR="${DATA_DIR}/categories"
DETAILS_DIR="${DATA_DIR}/tools/details"

# 检查jq是否安装
if ! command -v jq &> /dev/null; then
  echo "错误: 未安装jq工具，请先安装jq: brew install jq"
  exit 1
fi

# 获取工具总数
TOTAL_TOOLS=$(jq '.tools | length' "$TOOLS_FILE")
echo "开始更新 $TOTAL_TOOLS 个工具的评分..."

# 临时文件
TEMP_FILE=$(mktemp)

# 为所有类别文件中的工具更新评分
echo "正在更新类别文件中的工具评分..."
for category_file in "$CATEGORIES_DIR"/*.json; do
  if [[ $(basename "$category_file") == "index.json" ]]; then
    continue
  fi
  
  CATEGORY_ID=$(jq -r '.id' "$category_file")
  echo "处理类别: $CATEGORY_ID"
  
  # 为每个工具生成随机评分
  jq '(.tools[] | select(has("rating") | not) | .rating) |= {"score": (4 + (random * 1) | floor * 0.1 + 4), "count": (10 + (random * 190) | floor)}' "$category_file" > "$TEMP_FILE"
  
  # 更新已有评分的工具
  jq '(.tools[] | select(has("rating")) | .rating.score) |= (4 + (random * 1) | floor * 0.1 + 4) | (.tools[] | select(has("rating")) | .rating.count) |= (10 + (random * 190) | floor)' "$TEMP_FILE" > "${TEMP_FILE}.2"
  
  # 更新原始文件
  mv "${TEMP_FILE}.2" "$category_file"
done

echo "正在更新详情文件中的工具评分..."
# 递归更新所有详情文件中的评分
find "$DETAILS_DIR" -type f -name "*.json" | while read detail_file; do
  # 检查是否已有评分
  if jq -e 'has("rating")' "$detail_file" > /dev/null; then
    # 更新已有评分
    SCORE=$(awk 'BEGIN{print 4 + int(rand() * 10) / 10}')
    COUNT=$(( 10 + RANDOM % 190 ))
    jq --arg score "$SCORE" --arg count "$COUNT" '.rating.score = ($score | tonumber) | .rating.count = ($count | tonumber)' "$detail_file" > "$TEMP_FILE"
  else
    # 添加新评分
    SCORE=$(awk 'BEGIN{print 4 + int(rand() * 10) / 10}')
    COUNT=$(( 10 + RANDOM % 190 ))
    jq --arg score "$SCORE" --arg count "$COUNT" '. + {rating: {score: ($score | tonumber), count: ($count | tonumber)}}' "$detail_file" > "$TEMP_FILE"
  fi
  mv "$TEMP_FILE" "$detail_file"
done

# 更新主工具文件中的评分
echo "正在更新主工具文件中的评分..."
jq '(.tools[] | .rating) |= {"score": (4 + (random * 1) | floor * 0.1 + 4), "count": (10 + (random * 190) | floor)}' "$TOOLS_FILE" > "$TEMP_FILE"
mv "$TEMP_FILE" "$TOOLS_FILE"

echo "完成! 已为所有工具更新评分。"

# 可以运行tools更新脚本以确保一致性
echo "建议运行 ./scripts/update_tools_from_categories.sh 以确保评分一致性。" 