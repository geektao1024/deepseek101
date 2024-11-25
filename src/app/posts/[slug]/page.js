import { getSortedPostsData, getPostData } from '@/lib/posts'
import { ArticleLayout } from '@/components/ArticleLayout'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export async function generateMetadata({ params }) {
  const postData = await getPostData(params.slug)
  return {
    title: postData.title,
    description: postData.description || `Read about ${postData.title}`,
  }
}

export default async function Post({ params }) {
  const postData = await getPostData(params.slug)
  const allPosts = getSortedPostsData()
  
  // 添加日志
  console.log('Post data headings:', postData.headings);
  
  return (
    <ArticleLayout
      article={{
        id: params.slug,
        title: postData.title,
        tags: postData.tags || [],
        headings: postData.headings || []
      }}
      allArticles={allPosts.map(post => ({
        id: post.id,
        title: post.title,
        tags: post.tags || []
      }))}
    >
      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/posts" className="hover:text-gray-900">Articles</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{postData.title}</span>
      </div>

      {/* 文章元信息 - 添加背景和圆角 */}
      <div className="mb-8 bg-blue-50/50 rounded-xl p-6 border border-blue-100/50">
        <time className="text-sm text-blue-600/80 font-medium">
          {new Date(postData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        {postData.description && (
          <p className="mt-3 text-lg text-gray-600 leading-relaxed">
            {postData.description}
          </p>
        )}
      </div>
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />
    </ArticleLayout>
  )
}