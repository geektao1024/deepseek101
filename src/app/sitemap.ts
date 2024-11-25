import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lemobook.vercel.app'
  const articles = getSortedPostsData()

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
    lastModified: new Date(post.lastModified || post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...posts]
} 