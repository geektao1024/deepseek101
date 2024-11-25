import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@/lib/posts'

// 定义文章的接口类型
interface Article {
  id: string
  title: string
  description: string
  date: string
  lastModified?: string  // 使用可选属性，因为有些文章可能没有这个字段
  coverImage?: string
  tags?: string[]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lemobook.vercel.app'
  const articles = getSortedPostsData() as Article[]  // 添加类型断言

  // 基础页面
  const routes = [
    '',
    '/posts',
    '/resources',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // 文章页面
  const posts = articles.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.lastModified || post.date), // 如果没有 lastModified 就使用 date
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...posts]
} 