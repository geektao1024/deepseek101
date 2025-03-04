import React from 'react';
import fs from 'fs';
import path from 'path';
import ToolList from '@/components/ToolList';

export const metadata = {
  title: 'DeepSeek Tools',
  description: 'Discover and use the best DeepSeek tools to improve your productivity.',
};

export default function Tools() {
  // 读取分类数据
  const categoriesPath = path.join('data', 'json', 'categories', 'index.json');
  const { categories } = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  
  // 从各个分类文件中读取工具数据
  const allTools = [];
  
  // 遍历所有分类，读取每个分类文件中的工具
  categories.forEach(category => {
    try {
      const categoryFilePath = path.join('data', 'json', 'categories', `${category.id}.json`);
      if (fs.existsSync(categoryFilePath)) {
        const categoryData = JSON.parse(fs.readFileSync(categoryFilePath, 'utf8'));
        if (categoryData.tools && Array.isArray(categoryData.tools)) {
          // 为每个工具添加分类信息
          const toolsWithCategory = categoryData.tools.map(tool => ({
            ...tool,
            category: category.id
          }));
          allTools.push(...toolsWithCategory);
          
          // 更新分类中的工具数量
          category.tool_count = categoryData.tools.length;
        }
      }
    } catch (error) {
      console.error(`Error reading category file for ${category.id}:`, error);
    }
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">DeepSeek Tools</h1>
      <ToolList categories={categories} tools={allTools} showMoreLink={false} />
    </div>
  );
} 