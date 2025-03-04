import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PropTypes from 'prop-types'
import fs from 'fs'
import path from 'path'
import { ChevronRight, Star, GitFork, Eye, Github, ExternalLink, Calendar, Code } from 'lucide-react'
import { getToolIconPath, getToolScreenshotPath } from '@/services/iconService'
import { getRepositoryInfo, getRepositoryContributors, getRepositoryLanguages } from '@/services/githubService'
import ToolScreenshot from '@/components/ToolScreenshot'

// 定义语言颜色映射
const LANGUAGE_COLOR_MAP = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  CSS: 'bg-purple-500',
  HTML: 'bg-orange-500',
  Python: 'bg-blue-600',
  Java: 'bg-red-600',
  Go: 'bg-teal-500',
  Ruby: 'bg-red-500',
  PHP: 'bg-indigo-400',
  C: 'bg-gray-600',
  'C++': 'bg-pink-500',
  'C#': 'bg-green-600',
  Shell: 'bg-green-400',
  EJS: 'bg-gray-400'
};

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
    const detailPath = path.join(
      'data', 
      'json', 
      'tools', 
      'details', 
      category, 
      `${id}.json`
    )
    
    // 如果存在详情文件，则合并详情数据，否则只返回基础数据
    if (fs.existsSync(detailPath)) {
      try {
        const detailContent = await fs.promises.readFile(detailPath, 'utf8')
        const detailData = JSON.parse(detailContent)
        // 合并基础数据和详情数据
        return { ...basicToolInfo, ...detailData }
      } catch (detailError) {
        console.error('Error reading detailed tool data:', detailError)
      }
    }
    
    // 如果没有找到详情文件或读取出错，则返回基础数据
    return basicToolInfo
  } catch (error) {
    console.error('Error reading tool data:', error)
    return null
  }
}

// 获取工具的相关工具
async function getRelatedTools(category, currentToolId, limit = 3) {
  try {
    const categoryFilePath = path.join('data', 'json', 'categories', `${category}.json`)
    if (fs.existsSync(categoryFilePath)) {
      const categoryData = JSON.parse(await fs.promises.readFile(categoryFilePath, 'utf8'))
      if (categoryData.tools && Array.isArray(categoryData.tools)) {
        // 过滤掉当前工具
        const filteredTools = categoryData.tools.filter(tool => tool.id !== currentToolId);
        // 限制数量
        return filteredTools.slice(0, limit);
      }
    }
    return []
  } catch (error) {
    console.error('Error getting related tools:', error)
    return []
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

  // 获取相关工具
  const relatedTools = await getRelatedTools(tool.category, params.id)

  // 从GitHub API获取仓库信息
  let repoStats = {
    stars: tool.stars || 0,
    forks: tool.forks || 0,
    watchers: tool.watchers || 0,
    lastCommit: tool.lastCommit || 'unknown',
    repoAge: tool.repoAge || 'unknown',
    license: tool.license || 'unknown'
  };
  
  // 尝试从GitHub API获取数据
  if (tool.repositoryUrl && tool.repositoryUrl.includes('github.com')) {
    const apiRepoInfo = await getRepositoryInfo(tool.repositoryUrl);
    if (apiRepoInfo) {
      repoStats = apiRepoInfo;
    }
  }

  // 从GitHub API获取贡献者信息
  let contributors = tool.contributors || [];
  
  // 尝试从GitHub API获取贡献者数据
  if (tool.repositoryUrl && tool.repositoryUrl.includes('github.com')) {
    const apiContributors = await getRepositoryContributors(tool.repositoryUrl, 5);
    if (apiContributors) {
      contributors = apiContributors;
    }
  }

  // 从GitHub API获取语言分布信息
  let languages = [];
  
  // 尝试从GitHub API获取语言数据
  if (tool.repositoryUrl && tool.repositoryUrl.includes('github.com')) {
    const apiLanguages = await getRepositoryLanguages(tool.repositoryUrl);
    if (apiLanguages) {
      languages = apiLanguages;
    }
  }

  // 实施指南数据 - 仅使用工具详情中提供的数据
  const implementationGuide = tool.implementationGuide || null;

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

      {/* 产品标题和简介 - 全宽度突出显示 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row items-center gap-1 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-6 flex-1 max-w-3xl">
            <div className="w-24 h-24 relative rounded-xl overflow-hidden border border-gray-200 bg-white flex-shrink-0">
              <Image
                src={getToolIconPath(tool.id, tool.url, undefined, tool.official_url)}
                alt={tool.name}
                width={96}
                height={96}
                className="object-contain p-2"
                sizes="96px"
                quality={90}
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              <p className="mt-2 text-lg text-gray-600 md:pr-1">{tool.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                <a 
                  href={tool.repositoryUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  <Github className="w-4 h-4" /> View Repository
                </a>
                <a 
                  href={tool.official_url || tool.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <ExternalLink className="w-4 h-4" /> Visit Website
                </a>
              </div>
            </div>
          </div>
          
          {/* 官网截图展示 */}
          <div className="mt-6 lg:mt-0 lg:-ml-4">
            <ToolScreenshot 
              src={tool.screenshots && Array.isArray(tool.screenshots) && tool.screenshots.length > 0
                  ? tool.screenshots[0].url  // 使用工具详情中的截图
                  : getToolScreenshotPath(tool.id)}  // 否则使用默认路径
              alt={tool.screenshots && Array.isArray(tool.screenshots) && tool.screenshots.length > 0
                  ? (tool.screenshots[0].caption || `${tool.name} 官网截图`)
                  : `${tool.name} 官网截图`}
              url={tool.official_url || tool.url}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧：详细内容 */}
        <div className="md:col-span-2 space-y-8">
          {/* 概述 */}
          {tool.content?.overview && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> Overview
              </h2>
              <p className="text-gray-600 leading-relaxed">{tool.content.overview}</p>
            </section>
          )}

          {/* 特性列表 */}
          {tool.content?.features?.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-500 rounded-full"></span> Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tool.content.features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 实施指南 - 只在有数据时显示 */}
          {implementationGuide?.phases?.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span> Implementation Guide
              </h2>
              
              <div className="relative">
                {/* 时间线 */}
                <div className="absolute left-3 top-0 w-1 h-full bg-gray-200 rounded-full"></div>
                
                <div className="space-y-8 relative">
                  {implementationGuide.phases.map((phase, index) => (
                    <div key={index} className="pl-12 relative">
                      <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-blue-100 text-blue-600 border-2 border-blue-300' :
                        index === 1 ? 'bg-green-100 text-green-600 border-2 border-green-300' :
                        'bg-purple-100 text-purple-600 border-2 border-purple-300'
                      }`}>
                        {index + 1}
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{phase.name}</h3>
                      <p className="text-sm text-gray-600">{phase.description}</p>
                    </div>
                  ))}
                </div>
                
                {implementationGuide.milestones && (
                  <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-gray-900">Key Milestones:</span>
                      <span className="text-gray-600">{implementationGuide.milestones}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 使用场景 */}
          {tool.content?.useCases?.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span> Use Cases
              </h2>
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
          {tool.content?.advantages?.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-500 rounded-full"></span> Advantages
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {tool.content.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-600">{advantage}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {tool.content?.faqs?.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span> FAQs
              </h2>
              <div className="space-y-6">
                {tool.content.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4 bg-gray-50 last:mb-0">
                    <h3 className="font-medium text-gray-900 mb-2">Q: {faq.question}</h3>
                    <p className="text-sm text-gray-600">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 相关资源 */}
          {tool.content?.resources?.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> Related Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.content.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600">{resource.title}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 右侧：基本信息与相关内容 */}
        <div className="md:col-span-1 space-y-6">
          {/* 仓库详情卡片 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Repository Stats
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Star className="w-4 h-4" /> Stars
                </div>
                <span className="font-medium">{repoStats.stars.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <GitFork className="w-4 h-4" /> Forks
                </div>
                <span className="font-medium">{repoStats.forks.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Eye className="w-4 h-4" /> Watch
                </div>
                <span className="font-medium">{repoStats.watchers.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" /> Last commit
                </div>
                <span className="font-medium">{repoStats.lastCommit}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" /> Repository age
                </div>
                <span className="font-medium">{repoStats.repoAge}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Code className="w-4 h-4" /> License
                </div>
                <span className="font-medium">{repoStats.license}</span>
              </div>
              
              <div className="mt-4 pt-2">
                <Link
                  href={tool.repositoryUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4" /> View Repository
                </Link>
              </div>
            </div>
          </div>
          
          {/* 语言分布卡片 */}
          {languages.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Language distribution
              </h2>
              
              {/* 进度条 */}
              <div className="w-full h-2 bg-gray-100 rounded-full mb-4 flex overflow-hidden">
                {languages.map((lang) => (
                  <div 
                    key={lang.name}
                    className={`h-full ${LANGUAGE_COLOR_MAP[lang.name] || 'bg-gray-500'}`} 
                    style={{ width: `${lang.percentage}%` }}
                  />
                ))}
              </div>
              
              {/* 语言列表 */}
              <div className="space-y-2">
                {languages.slice(0, 5).map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${LANGUAGE_COLOR_MAP[lang.name] || 'bg-gray-500'}`}></span>
                      <span className="text-gray-700">{lang.name}</span>
                    </div>
                    <span className="text-gray-700">{lang.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
                Based on repository file analysis
              </div>
            </div>
          )}
          
          {/* 贡献者卡片 - 新增部分 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top contributors
            </h2>
            
            <div className="space-y-4">
              {contributors.slice(0, 5).map((contributor, index) => (
                <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {contributor.avatarUrl ? (
                        <Image 
                          src={contributor.avatarUrl} 
                          alt={contributor.name}
                          width={40}
                          height={40}
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-500">
                          {contributor.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-orange-500' : 'bg-gray-500'}`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{contributor.name}</div>
                    <div className="text-sm text-gray-500">~ {contributor.commits} commits</div>
                  </div>
                </div>
              ))}
              
              <a
                href={tool.repositoryUrl ? `${tool.repositoryUrl}/graphs/contributors` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-gray-800 font-medium py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                View All Contributors
              </a>
            </div>
            <div className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
              Sorted by number of contributions
            </div>
          </div>

          {/* 标签 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tool.tags?.map((tag, index) => (
                <Link
                  key={index}
                  href={`/tools?tag=${tag}`}
                  className="px-3 py-1.5 bg-gray-100 text-sm text-gray-600 rounded-full hover:bg-gray-200 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 相关工具 - 新增部分 */}
      {relatedTools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">More Products</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((relatedTool, index) => (
              <Link href={`/tools/${relatedTool.id}`} key={index}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 relative rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                      <Image
                        src={getToolIconPath(relatedTool.id, relatedTool.url, undefined, relatedTool.official_url)}
                        alt={relatedTool.name}
                        width={48}
                        height={48}
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-md">{relatedTool.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{relatedTool.description}</p>
                      
                      <div className="mt-3 flex flex-wrap gap-1">
                        {relatedTool.tags?.slice(0, 2).map((tag, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {relatedTool.tags?.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full">
                            +{relatedTool.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

ToolDetailPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
} 