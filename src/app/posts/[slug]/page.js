// 文章详情页面组件
// 用于展示单篇文章的详细内容,支持动态路由
import { getPostData } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

// 生成页面元数据
// 根据文章数据动态生成页面的标题和描述
export async function generateMetadata({ params }) {
  const postData = await getPostData(params.slug);
  return {
    title: `${postData.title}`,
    description: postData.description || `Read about ${postData.title} on GitBase`,
  };
}

// 文章详情页面组件
export default async function Post({ params }) {
    // 获取文章详细数据
  const postData = await getPostData(params.slug);
  
  return (
    // 文章容器,限制最大宽度并添加内边距
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      {/* 面包屑导航: 提供层级导航路径 */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="mx-2" size={16} />
        <Link href="/posts" className="hover:text-blue-600">Articles</Link>
        <ChevronRight className="mx-2" size={16} />
        <span className="text-gray-900">{postData.title}</span>
      </nav>
      
      {/* 文章元信息卡片: 展示发布日期和描述 */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        {postData.date && (
          <p className="text-gray-600 mb-2">{new Date(postData.date).toLocaleDateString()}</p>
        )}
        {postData.description && (
          <p className="text-gray-800">{postData.description}</p>
        )}
      </div>
      
      {/* 文章内容: 使用 prose 样式美化 Markdown 渲染结果 */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />
      
      {/* 返回文章列表链接 */}
      <div className="mt-12">
        <Link href="/posts" className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to articles
        </Link>
      </div>
    </article>
  );
}