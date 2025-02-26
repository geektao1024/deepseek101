/**
 * 工具迁移脚本
 * 
 * 此脚本用于将tools.json中的工具按照分类迁移到对应的分类JSON文件中
 * 
 * 使用方法: node scripts/migrate-tools.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 确定当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const DATA_DIR = path.join(__dirname, '../data/json');
const TOOLS_PATH = path.join(DATA_DIR, 'tools.json');
const CATEGORIES_DIR = path.join(DATA_DIR, 'categories');

// 主函数
async function migrateTools() {
  try {
    console.log('开始迁移工具数据...');
    
    // 读取tools.json
    const toolsData = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8'));
    const { tools, categories } = toolsData;
    
    // 按分类整理工具
    const toolsByCategory = {};
    
    // 初始化分类对象
    categories.forEach(category => {
      toolsByCategory[category.id] = {
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        last_updated: toolsData.last_updated || new Date().toISOString().split('T')[0],
        tools: []
      };
    });
    
    // 将工具分配到相应分类
    tools.forEach(tool => {
      const category = tool.category;
      if (toolsByCategory[category]) {
        // 确保分类ID正确
        toolsByCategory[category].tools.push(tool);
      } else {
        console.warn(`警告: 工具 "${tool.name}" 具有未知分类 "${category}"`);
      }
    });
    
    // 写入分类文件
    for (const categoryId in toolsByCategory) {
      const categoryData = toolsByCategory[categoryId];
      const categoryPath = path.join(CATEGORIES_DIR, `${categoryId}.json`);
      
      // 检查分类文件是否已存在
      if (fs.existsSync(categoryPath)) {
        console.log(`分类文件 ${categoryId}.json 已存在，正在合并数据...`);
        const existingData = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
        
        // 只更新tools数组，保留其他数据
        existingData.tools = categoryData.tools;
        fs.writeFileSync(categoryPath, JSON.stringify(existingData, null, 2), 'utf8');
      } else {
        console.log(`创建新的分类文件: ${categoryId}.json`);
        fs.writeFileSync(categoryPath, JSON.stringify(categoryData, null, 2), 'utf8');
      }
      
      console.log(`已将 ${categoryData.tools.length} 个工具写入 ${categoryId}.json`);
    }
    
    console.log('迁移完成！您现在可以安全地移除 tools.json 文件。');
  } catch (error) {
    console.error('迁移过程中出现错误:', error);
  }
}

// 执行迁移
migrateTools(); 