'use client'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Star, Layers, AppWindow, Brain, Database, Code, FileSpreadsheet, MessageSquare, Globe, Terminal, List, Bot, Edit, Shield, MoreHorizontal } from 'lucide-react'
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// 从URL获取本地favicon的函数
function getFaviconPath(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    return `/images/favicon/${hostname}.png`;
  } catch (e) {
    console.error('Error parsing URL:', e);
    return '/images/favicon/default.png';
  }
}

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
    })
  ).isRequired,
};

export default function ToolList({ categories, tools }) {
  const [failedImages, setFailedImages] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('all');

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
    };
    const IconComponent = iconMap[iconName] || Layers;
    return IconComponent;
  };

  const handleImageError = (url) => {
    setFailedImages(prev => new Set(prev).add(url));
  };

  // 按类别过滤工具
  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="space-y-8 container mx-auto">
      {/* 标签云 */}
      <div className="tag-cloud">
        <Badge
          key="all"
          variant={activeCategory === 'all' ? 'default' : 'secondary'}
          className={`tag-cloud-item ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          <Layers className="w-4 h-4 mr-1" />
          全部
        </Badge>
        {categories.map(category => {
          const IconComponent = getIconComponent(category.icon);
          return (
            <Badge
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'secondary'}
              className={`tag-cloud-item ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <IconComponent className="w-4 h-4 mr-1" />
              {category.name}
            </Badge>
          );
        })}
      </div>

      {/* 工具列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool, index) => (
          <Card key={tool.id} className="flex flex-col hover:shadow-lg transition-all duration-300 group rounded-2xl overflow-hidden">
            <div className="flex items-start p-4 h-full">
              {/* Logo 区域 */}
              <div className="w-12 h-12 flex-shrink-0 relative mr-4">
                <Image
                  src={failedImages.has(tool.url) ? '/images/favicon/default.png' : getFaviconPath(tool.url)}
                  alt={`${tool.name} logo`}
                  fill
                  className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  onError={() => handleImageError(tool.url)}
                  priority={index < 6}
                />
              </div>
              
              {/* 内容区域 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {/* 标题 */}
                  <Link 
                    href={`/tools/${tool.id}`}
                    className="group/link flex-1 min-w-0"
                  >
                    <CardTitle className="text-[15px] font-semibold text-gray-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </CardTitle>
                  </Link>
                  
                  {/* 外部链接 */}
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="访问官网"
                  >
                    <ExternalLink size={14} />
                  </a>
                  
                  {/* 评分 */}
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star size={12} className="fill-current" />
                    <span>{tool.rating.score}</span>
                    <span className="text-gray-400">({tool.rating.count})</span>
                  </div>
                </div>

                {/* 描述 */}
                <CardDescription className="text-xs leading-relaxed text-gray-500 line-clamp-2 group-hover:text-gray-600 transition-colors mb-2">
                  {tool.description}
                </CardDescription>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] bg-gray-50 text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 