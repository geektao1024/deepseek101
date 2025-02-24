// pages/index.js
import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import ResourceList from '@/components/ResourceList'
import ToolList from '@/components/ToolList'
import ArticleList from '@/components/ArticleList'
import { Metadata } from 'next'

// 首页组件: LemoBook 网站的主页面
// 展示网站概述、资源列表和最新文章列表
export const metadata: Metadata = {
  title: 'DeepSeek101 - DeepSeek 工具发现平台',
  description: '发现和使用最好的 DeepSeek 工具，提升您的工作效率。',
}

export default function Home() {
  // 读取工具数据
  const toolsPath = path.join(process.cwd(), 'data', 'json', 'tools.json')
  const { categories, tools } = JSON.parse(fs.readFileSync(toolsPath, 'utf8'))
  
  // 获取所有文章数据
  const allPostsData = getSortedPostsData()

  return (
    // 页面主容器,使用 Tailwind 类设置布局和间距
    <div className="container mx-auto py-12 space-y-16">
      {/* 头部区域: 包含网站标题、副标题和简介 */}
      <section className="text-center space-y-4">
        {/* 主标题: 响应式字体大小设置 */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          DeepSeek101
        </h1>
        {/* 副标题: 响应式字体大小设置 */}
        <h2 className="text-2xl tracking-tighter sm:text-3xl md:text-3xl lg:text-3xl">
          发现优质 DeepSeek 工具
        </h2>
        {/* 网站简介: 最大宽度限制和响应式文本大小 */}
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          DeepSeek101 是一个专注于发现和分享优质 DeepSeek 工具的平台，帮助您找到最适合的 AI 工具提升工作效率。
        </p>
      </section>

      {/* 工具导航 */}
      <ToolList categories={categories} tools={tools} showMoreLink={true} />

      {/* 文章列表组件: 展示最新12篇文章，不启用分页 */}
      <ArticleList 
        articles={allPostsData} 
        showMoreLink={true} 
        enablePagination={false}
      />
    </div>
  )
}