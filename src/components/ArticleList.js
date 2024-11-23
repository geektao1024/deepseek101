'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { LayoutGrid, List, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ArticleList({ 
  articles, 
  showMoreLink = true,
  enablePagination = false,
  itemsPerPage = 50,
  homePageLimit = 12,
  allTags = []
}) {
  const [layout, setLayout] = useState('masonry')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState(null)

  // 根据选中的标签过滤文章
  const getFilteredArticles = () => {
    if (!selectedTag) return articles;
    return articles.filter(article => 
      article.tags && article.tags.includes(selectedTag)
    );
  }

  // 获取当前页的文章
  const getCurrentPageArticles = () => {
    const filteredArticles = getFilteredArticles();
    
    // 如果是主页，限制显示数量
    if (showMoreLink) {
      return filteredArticles.slice(0, homePageLimit);
    }
    // 否则进行分页处理
    if (enablePagination) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredArticles.slice(startIndex, endIndex);
    }
    return filteredArticles;
  }

  // 处理标签点击
  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setCurrentPage(1);  // 重置页码
  }

  // 计算总页数（基于过滤后的文章）
  const totalPages = Math.ceil(getFilteredArticles().length / itemsPerPage)

  const currentArticles = getCurrentPageArticles();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tighter">Articles</h2>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={layout === 'masonry' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLayout('masonry')}
              className="px-2"
              icon={<LayoutGrid className="h-4 w-4" />}
            />
            <Button
              variant={layout === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLayout('list')}
              className="px-2"
              icon={<List className="h-4 w-4" />}
            />
          </div>
        </div>
        {showMoreLink && (
          <Link href="/posts" className="text-blue-600 hover:text-blue-800 transition-colors">
            More articles →
          </Link>
        )}
      </div>

      {/* 标签过滤器 - 只在文章列表页显示 */}
      {!showMoreLink && allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all",
                "border border-gray-200",
                selectedTag === tag
                  ? "bg-blue-50 text-blue-600 border-blue-200 font-medium shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span>{tag}</span>
              {selectedTag === tag && (
                <X className="h-3.5 w-3.5 text-blue-500 hover:text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* 显示过滤结果统计 */}
      {selectedTag && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {getFilteredArticles().length} articles tagged with "{selectedTag}"
        </p>
      )}

      {layout === 'masonry' ? (
        // 瀑布流布局
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {currentArticles.map(({ id, title, description, tags = [], coverImage }) => (
            <Card 
              key={id} 
              className="break-inside-avoid-column hover:shadow-lg transition-shadow"
            >
              {coverImage && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={coverImage.startsWith('/') ? coverImage : `/${coverImage}`}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardHeader>
                <div className="space-y-2">
                  <Link href={`/posts/${id}`} className="group">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {title}
                    </CardTitle>
                  </Link>
                  <CardDescription className="line-clamp-4">
                    {description}
                  </CardDescription>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map(tag => (
                        <span 
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        // 列表布局
        <div className="space-y-6">
          {currentArticles.map(({ id, title, description, tags = [] }) => (
            <Card key={id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="space-y-2">
                  <Link 
                    href={`/posts/${id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                  >
                    <CardTitle>{title}</CardTitle>
                    →
                  </Link>
                  <CardDescription>{description}</CardDescription>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span 
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* 分页控制 - 只在启用分页且总页数大于1时显示 */}
      {enablePagination && totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? 'default' : 'outline'}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  )
}