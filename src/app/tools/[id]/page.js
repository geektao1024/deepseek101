import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PropTypes from 'prop-types'
import fs from 'fs'
import path from 'path'
import { ChevronRight } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

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
    // 读取分类数据，用于遍历查找工具
    const categoriesPath = path.join('data', 'json', 'categories', 'index.json')
    const { categories } = JSON.parse(await fs.promises.readFile(categoriesPath, 'utf8'))
    
    let basicToolInfo = null
    let category = null
    
    // 遍历所有分类文件，查找工具基本信息
    for (const cat of categories) {
      const categoryFilePath = path.join('data', 'json', 'categories', `${cat.id}.json`)
      if (fs.existsSync(categoryFilePath)) {
        const categoryData = JSON.parse(await fs.promises.readFile(categoryFilePath, 'utf8'))
        if (categoryData.tools && Array.isArray(categoryData.tools)) {
          const foundTool = categoryData.tools.find(tool => tool.id === id)
          if (foundTool) {
            basicToolInfo = foundTool
            category = cat.id
            // 为工具添加分类信息
            basicToolInfo.category = category
            break
          }
        }
      }
    }
    
    if (!basicToolInfo) return null
    
    // 尝试从详情目录读取完整数据
    try {
      // 查找详情文件
      const detailPath = path.join(
        'data', 
        'json', 
        'tools', 
        'details', 
        category, 
        `${id}.json`
      )
      
      if (fs.existsSync(detailPath)) {
        const detailContent = await fs.promises.readFile(detailPath, 'utf8')
        const detailData = JSON.parse(detailContent)
        // 合并基础数据和详情数据
        return { ...basicToolInfo, ...detailData }
      }
    } catch (detailError) {
      console.error('Error reading detailed tool data:', detailError)
    }
    
    // 如果没有找到详情文件或读取出错，则返回基础数据
    return basicToolInfo
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
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/tools" className="hover:text-gray-900">Tools</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{tool.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧：详细内容 */}
        <div className="md:col-span-2 space-y-8">
          {/* 概述 */}
          {tool.content?.overview && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">{tool.content.overview}</p>
            </section>
          )}

          {/* 特性列表 */}
          {tool.content?.features && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Use Cases</h2>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Advantages</h2>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">FAQs</h2>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Resources</h2>
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
                    See more {tool.category} →
                  </Link>
                </div>
              )}
            </div>

            {/* 工具特性 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {/* 免费标签 */}
                {tool.isFree && (
                  <Badge variant="outline" className="px-3 py-1 border-green-200 bg-green-50 text-green-700 text-sm font-medium">
                    免费
                  </Badge>
                )}
                
                {/* 开源标签 */}
                {tool.isOpenSource && (
                  <Badge variant="outline" className="px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium">
                    开源
                  </Badge>
                )}
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
                Share
              </button>
              <button className="flex-1 px-4 py-2 text-sm text-red-500 hover:text-red-600 border border-red-500 hover:border-red-600 rounded-lg">
                Report
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