// components/ResourceList.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

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

export default function ResourceList({ resources, showMoreLink = true }) {
  const [failedImages, setFailedImages] = useState(new Set());

  const handleImageError = (url) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tighter">Resources</h2>
        {showMoreLink && (
          <Link href="/resources" className="text-blue-600 hover:text-blue-800 transition-colors">
            More resources →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="flex h-[130px] hover:shadow-lg transition-shadow group">
            {/* Logo 区域 */}
            <div className="w-[100px] p-4 flex items-center justify-center relative">
              <div className="relative w-12 h-12">
                <Image
                  src={failedImages.has(resource.url) ? '/images/favicon/default.png' : getFaviconPath(resource.url)}
                  alt={`${resource.name} logo`}
                  fill
                  className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  onError={() => handleImageError(resource.url)}
                  priority={index < 4}
                />
              </div>
            </div>
            
            {/* 内容区域 - 优化层次感 */}
            <div className="flex-1 p-4 flex flex-col justify-center min-w-0 relative">
              {/* 标题区域 */}
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group/link"
              >
                <CardTitle className="text-[15px] font-semibold text-gray-900 mb-1.5 truncate leading-tight group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  {resource.name}
                  <ExternalLink size={14} className="inline-block opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </CardTitle>
              </a>
              {/* 描述区域 */}
              <CardDescription className="text-xs leading-relaxed text-gray-500 line-clamp-2 group-hover:text-gray-600 transition-colors">
                {resource.description}
              </CardDescription>
              {/* 背景装饰 - 增加视觉层次 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}