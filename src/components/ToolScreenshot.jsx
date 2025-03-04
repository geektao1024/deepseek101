'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

/**
 * 工具截图展示组件 - 客户端组件，处理图片加载错误
 * 优化版：更大尺寸，更美观的交互效果
 */
export default function ToolScreenshot({ src, alt, url }) {
  const [imgSrc, setImgSrc] = useState(src || '/images/placeholder-screenshot.jpg');
  const [isHovered, setIsHovered] = useState(false);
  const [isImgError, setIsImgError] = useState(false);
  
  // 当 src 属性变化时更新图片源
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setIsImgError(false);
    }
  }, [src]);
  
  // 处理图片加载错误
  const handleImageError = () => {
    console.log('Image failed to load, using placeholder');
    setIsImgError(true);
    setImgSrc('/images/placeholder-screenshot.jpg');
  };
  
  return (
    <div 
      className="hidden lg:block w-96 h-64 relative rounded-xl overflow-hidden bg-white shadow-xl transition-all duration-300 ease-in-out"
      style={{ 
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 浏览器风格的顶部栏 */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 border-b border-gray-200 flex items-center px-2 z-10">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
      </div>

      {/* 截图内容区域 */}
      <div className="pt-6 w-full h-full relative">
        {!isImgError ? (
          <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 ease-in-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            sizes="(min-width: 1024px) 24rem, 100vw"
            quality={90}
            priority
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <div className="text-gray-400 mb-2">预览不可用</div>
              {url && <div className="text-sm text-gray-500 truncate max-w-[16rem]">{url}</div>}
            </div>
          </div>
        )}
      </div>

      {/* 悬停时显示的访问按钮 */}
      {url && (
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 ease-in-out z-20"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/90 text-gray-900 rounded-full text-sm font-medium hover:bg-white transition-colors duration-200 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              Visit Website
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// 属性类型验证
ToolScreenshot.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  url: PropTypes.string
}; 