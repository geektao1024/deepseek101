#!/bin/bash

# 这个脚本用于清理旧的目录结构

# 确认操作
echo "警告: 此操作将删除 data/json/categories/details 目录及其所有内容"
read -p "确定要继续吗? (y/n) " -n 1 -r
echo    # 换行
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "操作已取消"
    exit 1
fi

# 删除旧的目录
if [ -d "data/json/categories/details" ]; then
  rm -rf data/json/categories/details
  echo "已删除: data/json/categories/details"
else
  echo "目录不存在: data/json/categories/details"
fi

echo "清理完成" 