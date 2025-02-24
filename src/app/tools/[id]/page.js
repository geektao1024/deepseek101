import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PropTypes from 'prop-types'
import fs from 'fs'
import path from 'path'
import { ChevronRight } from 'lucide-react'

// 从URL获取favicon的函数
function getFaviconPath(url) {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace('www.', '')
    return `/images/favicon/${hostname}.png`
  } catch (e) {
    console.error('Error parsing URL:', e)
    return '/images/favicon/default.png'
  }
}

// 根据ID获取工具数据
async function getToolById(id) {
  try {
    // 尝试从详情目录读取完整数据
    const detailPath = path.join('data', 'tools', 'details', `${id}.json`)
    if (fs.existsSync(detailPath)) {
      const detailContent = await fs.promises.readFile(detailPath, 'utf8')
      return JSON.parse(detailContent)
    }
    
    // 如果没有详情文件，则从基础数据文件读取
    const toolsPath = path.join('data', 'json', 'tools.json')
    const fileContents = await fs.promises.readFile(toolsPath, 'utf8')
    const { tools } = JSON.parse(fileContents)
    return tools.find(tool => tool.id === id) || null
  } catch (error) {
    console.error('Error reading tool data:', error)
    return null
  }
}

// 工具详情页面组件
export default async function ToolDetailPage({ params }) {
  if (!params?.id) {
    notFound()
  }

  const tool = await getToolById(params.id)
  
  if (!tool) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/tools" className="hover:text-gray-900">工具</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{tool.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧：详细内容 */}
        <div className="md:col-span-2 space-y-8">
          {/* 概述 */}
          {tool.content?.overview && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">概述</h2>
              <p className="text-gray-600 leading-relaxed">{tool.content.overview}</p>
            </section>
          )}

          {/* 特性列表 */}
          {tool.content?.features && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">主要特性</h2>
              <div className="space-y-4">
                {tool.content.features.map((feature, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 使用场景 */}
          {tool.content?.useCases && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">使用场景</h2>
              <div className="space-y-4">
                {tool.content.useCases.map((useCase, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium text-gray-900 mb-2">{useCase.title}</h3>
                    <p className="text-sm text-gray-600">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 优势列表 */}
          {tool.content?.advantages && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">主要优势</h2>
              <ul className="list-disc list-inside space-y-2">
                {tool.content.advantages.map((advantage, index) => (
                  <li key={index} className="text-gray-600">{advantage}</li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQ */}
          {tool.content?.faqs && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">常见问题</h2>
              <div className="space-y-6">
                {tool.content.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 相关资源 */}
          {tool.content?.resources && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">相关资源</h2>
              <div className="space-y-3">
                {tool.content.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-500 hover:text-blue-600"
                  >
                    {resource.title} →
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 右侧：基本信息 */}
        <div className="md:col-span-1 space-y-6">
          {/* 工具信息卡片 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 relative rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={getFaviconPath(tool.url)}
                  alt={tool.name}
                  width={96}
                  height={96}
                  className="object-contain p-2"
                />
              </div>
            </div>

            {/* 基本信息 */}
            <div className="text-center space-y-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{tool.name}</h1>
                <p className="mt-2 text-sm text-gray-500">{tool.description}</p>
              </div>

              <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                By <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">{tool.url}</a>
              </div>

              {tool.category && (
                <div className="flex items-center justify-center gap-2">
                  <Link 
                    href={`/tools?category=${tool.category}`}
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    查看更多 {tool.category} →
                  </Link>
                </div>
              )}
            </div>

            {/* 评分 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-gray-900">{tool.rating.score}</div>
                <div className="text-sm text-gray-500">
                  基于 {tool.rating.count} 个评价
                </div>
              </div>
            </div>

            {/* 标签 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {tool.tags?.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tools?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full hover:bg-gray-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2">
              <button className="flex-1 px-4 py-2 text-sm text-blue-500 hover:text-blue-600 border border-blue-500 hover:border-blue-600 rounded-lg">
                分享
              </button>
              <button className="flex-1 px-4 py-2 text-sm text-red-500 hover:text-red-600 border border-red-500 hover:border-red-600 rounded-lg">
                举报
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ToolDetailPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
} 