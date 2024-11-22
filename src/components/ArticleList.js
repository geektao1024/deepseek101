'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { LayoutGrid, List } from 'lucide-react'

export default function ArticleList({ articles, showMoreLink = true }) {
  const [layout, setLayout] = useState('masonry')

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
            >
              
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLayout('list')}
              className="px-2"
              icon={<List className="h-4 w-4" />}
            >
              
            </Button>
          </div>
        </div>
        {showMoreLink && (
          <Link href="/posts" className="text-blue-600 hover:text-blue-800 transition-colors">
            More articles →
          </Link>
        )}
      </div>

      {layout === 'masonry' ? (
        // 瀑布流布局
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {articles.map(({ id, title, description, tags = [] }) => (
            <Card 
              key={id} 
              className="break-inside-avoid-column hover:shadow-lg transition-shadow"
            >
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
          {articles.map(({ id, title, description, tags = [] }) => (
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
    </section>
  )
}