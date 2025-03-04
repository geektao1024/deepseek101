'use client'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import { Layers, AppWindow, Brain, Database, Code, FileSpreadsheet, MessageSquare, Globe, Terminal, List, Bot, Edit, Shield, MoreHorizontal } from 'lucide-react'
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getToolIconPath, getIconLoadChain, checkIconExists } from '@/services/iconService'

// PropTypes 定义
ToolList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      rating: PropTypes.shape({
        score: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
      }).isRequired,
      stars: PropTypes.number,
      forks: PropTypes.number,
      views: PropTypes.number,
    })
  ).isRequired,
};

export default function ToolList({ categories, tools }) {
  const [failedImages, setFailedImages] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');
  
  // 添加详细的调试信息
  console.log("ToolList received tools:", typeof tools, Array.isArray(tools) ? tools.length : 'not an array');
  
  if (Array.isArray(tools) && tools.length > 0) {
    console.log("First tool in ToolList:", tools[0]);
    console.log("GitHub stats for first tool:", {
      name: tools[0].name,
      stars: tools[0].stars,
      forks: tools[0].forks,
      views: tools[0].views,
      starsType: typeof tools[0].stars,
      forksType: typeof tools[0].forks,
      viewsType: typeof tools[0].views
    });
  }
  
  // 检查是否有github_stats_updated_at字段
  const githubStatsUpdatedAt = tools.github_stats_updated_at;
  console.log("GitHub stats updated at in ToolList:", githubStatsUpdatedAt);
  
  // 获取图标组件
  const getIconComponent = (iconName) => {
    const iconMap = {
      'app': AppWindow,
      'brain': Brain,
      'database': Database,
      'code': Code,
      'data': FileSpreadsheet,
      'message-square': MessageSquare,
      'globe': Globe,
      'terminal': Terminal,
      'list': List,
      'bot': Bot,
      'edit': Edit,
      'shield': Shield,
      'more-horizontal': MoreHorizontal,
      'framework': Code,
      'rag': Database,
      'browser': Globe,
      'vscode': Code,
      'other': MoreHorizontal,
      'all': Layers
    };
    const IconComponent = iconMap[iconName] || Layers;
    return IconComponent;
  };

  // 处理图片加载错误的智能回退机制
  const handleImageError = async (toolId, url) => {
    // 如果已经处理过这个工具的图标，不重复处理
    if (failedImages.has(toolId) || loadedImages[toolId]) {
      return;
    }

    // 获取完整的图标加载链
    const iconLoadChain = getIconLoadChain(toolId, url);
    
    // 逐个尝试加载图标
    for (let i = 0; i < iconLoadChain.length; i++) {
      // 跳过第一个路径（因为它已经在初始加载中失败了）
      if (i === 0) continue;
      
      const iconPath = iconLoadChain[i];
      const exists = await checkIconExists(iconPath);
      
      if (exists) {
        // 找到可用图标，更新状态
        setLoadedImages(prev => ({
          ...prev,
          [toolId]: iconPath
        }));
        return;
      }
    }
    
    // 所有图标都加载失败，标记为失败
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(toolId);
      return newSet;
    });
  };

  // 按类别过滤工具
  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  // 格式化日期显示
  const formatLastUpdated = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
  }

  return (
    <div className="space-y-10 container mx-auto px-4 py-2">
      {/* 标签云 */}
      <div className="overflow-x-auto pb-4">
        <div className="tag-cloud flex flex-wrap gap-2 mb-5 pb-4 border-b border-gray-50">
          <Badge
            key="all"
            variant={activeCategory === 'all' ? 'default' : 'secondary'}
            className={`tag-cloud-item cursor-pointer transition-all hover:bg-blue-50 px-3 py-1.5 rounded-full text-sm font-normal ${activeCategory === 'all' ? 'active bg-blue-50 hover:bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-600 hover:text-gray-800'} font-bangla tracking-normal`}
            onClick={() => setActiveCategory('all')}
          >
            <Layers className="w-4 h-4 mr-2" />
            全部
          </Badge>
          {categories.map(category => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <Badge
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'secondary'}
                className={`tag-cloud-item cursor-pointer transition-all hover:bg-blue-50 px-3 py-1.5 rounded-full text-sm font-normal tracking-normal ${activeCategory === category.id ? 'active bg-blue-50 hover:bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-600 hover:text-gray-800'} font-bangla`}
                onClick={() => setActiveCategory(category.id)}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.name}
                {category.tool_count > 0 && (
                  <span className="ml-2 text-xs bg-white rounded-full px-1.5 py-0.5 font-bangla">
                    {category.tool_count}
                  </span>
                )}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* 工具列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, index) => (
          <Card key={tool.id} className="flex flex-col hover:shadow-md hover:bg-gray-50 transition-all duration-300 group rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 bg-white">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center mb-5">
                {/* Logo 区域 */}
                <div className="w-10 h-10 flex-shrink-0 relative mr-3 rounded-md overflow-hidden bg-gray-50 p-1">
                  <Image
                    src={loadedImages[tool.id] || (failedImages.has(tool.id) ? '/images/favicon/default.png' : getToolIconPath(tool.id, tool.url))}
                    alt={`${tool.name} logo`}
                    fill
                    className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                    onError={() => handleImageError(tool.id, tool.url)}
                    priority={index < 9}
                    sizes="(max-width: 768px) 24px, 32px"
                    quality={90}
                  />
                </div>
                
                {/* 标题 */}
                <Link 
                  href={`/tools/${tool.id}`}
                  className="group/link flex-1 min-w-0"
                >
                  <CardTitle className="text-2xl font-normal text-gray-800 truncate leading-tight group-hover:text-blue-600 transition-colors font-bangla tracking-normal">
                    {tool.name}
                  </CardTitle>
                </Link>
              </div>
              
              {/* 标签行 */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-sm text-gray-600 whitespace-nowrap border border-gray-200 rounded-full px-2.5 py-0.5 bg-transparent font-bangla tracking-normal">
                    {tag}
                  </span>
                ))}
                {tool.tags.length > 3 && (
                  <span className="text-sm text-gray-600 whitespace-nowrap border border-gray-200 rounded-full px-2.5 py-0.5 bg-transparent font-bangla tracking-normal">
                    +{tool.tags.length - 3}
                  </span>
                )}
              </div>

              {/* 描述 */}
              <CardDescription className="text-sm leading-relaxed text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors mb-5 font-bangla tracking-normal">
                {tool.description}
              </CardDescription>
              
              {/* 分隔线 */}
              <div className="w-full h-px bg-gray-200 mb-4 mt-auto"></div>
              
              {/* Git统计数据 */}
              <div className="flex items-center gap-4 text-sm text-gray-500 font-bangla tracking-normal">
                {typeof tool.stars === 'number' && (
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current text-gray-400" aria-hidden="true">
                      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                    </svg>
                    <span>{tool.stars.toLocaleString()}</span>
                  </div>
                )}
                {typeof tool.forks === 'number' && (
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current text-gray-400" aria-hidden="true">
                      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                    </svg>
                    <span>{tool.forks.toLocaleString()}</span>
                  </div>
                )}
                {typeof tool.views === 'number' && (
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current text-gray-400" aria-hidden="true">
                      <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>
                    </svg>
                    <span>{tool.views.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 更新时间提示 */}
      {githubStatsUpdatedAt && (
        <div className="text-xs text-gray-500 mt-8 text-center font-sans">
          GitHub 统计数据于 {formatLastUpdated(githubStatsUpdatedAt)} 更新
        </div>
      )}
    </div>
  )
} 