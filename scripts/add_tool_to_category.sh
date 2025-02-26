#!/bin/bash

# 使用说明
function show_usage {
  echo "用法: $0 <工具ID> <类别ID>"
  echo "例如: $0 my-tool-id applications"
  echo ""
  echo "支持的类别:"
  echo "  applications, ai-frameworks, rag-frameworks, browser-extensions,"
  echo "  vscode-extensions, solana-frameworks, synthetic-data, im-plugins,"
  echo "  curation, visual-studio-extensions, neovim-extensions,"
  echo "  jetbrains-extensions, discord-bots, ai-code-editor, emacs,"
  echo "  security, others"
  exit 1
}

# 检查参数
if [ $# -ne 2 ]; then
  show_usage
fi

TOOL_ID=$1
CATEGORY_ID=$2

# 检查工具详情文件是否存在
DETAILS_SOURCE="data/tools/details/${TOOL_ID}.json"
if [ ! -f "$DETAILS_SOURCE" ]; then
  echo "错误: 工具详情文件 ${DETAILS_SOURCE} 不存在"
  exit 1
fi

# 检查类别是否存在
CATEGORY_FILE="data/json/categories/${CATEGORY_ID}.json"
if [ ! -f "$CATEGORY_FILE" ]; then
  echo "错误: 类别文件 ${CATEGORY_FILE} 不存在"
  echo "支持的类别: applications, ai-frameworks, rag-frameworks, browser-extensions, vscode-extensions, solana-frameworks, synthetic-data, im-plugins, curation, visual-studio-extensions, neovim-extensions, jetbrains-extensions, discord-bots, ai-code-editor, emacs, security, others"
  exit 1
fi

# 确保目标目录存在
DETAILS_TARGET_DIR="data/json/tools/details/${CATEGORY_ID}"
mkdir -p "$DETAILS_TARGET_DIR"

# 复制工具详情文件到目标目录
DETAILS_TARGET="${DETAILS_TARGET_DIR}/${TOOL_ID}.json"
cp "$DETAILS_SOURCE" "$DETAILS_TARGET"

# 使用jq更新详情文件的category字段
if command -v jq &> /dev/null; then
  jq ".category = \"${CATEGORY_ID}\"" "$DETAILS_TARGET" > "${DETAILS_TARGET}.tmp" && mv "${DETAILS_TARGET}.tmp" "$DETAILS_TARGET"
  echo "已更新工具详情文件的类别: $DETAILS_TARGET"
else
  echo "警告: 未找到jq命令，无法更新category字段。请手动更新。"
fi

echo "完成! 工具 $TOOL_ID 已添加到类别 $CATEGORY_ID"
echo "请记得手动将工具信息添加到类别文件: $CATEGORY_FILE"
echo "在类别文件中，details_file应设置为: ../tools/details/${CATEGORY_ID}/${TOOL_ID}.json" 