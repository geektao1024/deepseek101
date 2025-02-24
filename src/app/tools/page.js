import fs from 'fs';
import path from 'path';
import ToolList from '@/components/ToolList';

export const metadata = {
  title: 'DeepSeek 工具导航',
  description: '发现和使用最好的 DeepSeek 工具，提升您的工作效率。',
};

export default function Tools() {
  const toolsPath = path.join(process.cwd(), 'data', 'json', 'tools.json');
  const { categories, tools } = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

  return (
    <div className="container mx-auto py-12">
      <ToolList categories={categories} tools={tools} showMoreLink={false} />
    </div>
  );
} 