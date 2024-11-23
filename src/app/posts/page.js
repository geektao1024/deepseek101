// 文章列表页面组件
// 展示所有文章的列表页面
import ArticleList from '@/components/ArticleList'
import { getSortedPostsData } from '@/lib/posts';

// 配置页面元数据
export const metadata = {
  title: 'Articles',
  description: 'Read our latest articles on web development, GitHub tips, and best practices.',
};

// 文章列表页面组件
export default function Articles() {
    // 获取所有文章数据,按日期排序
  const allPostsData = getSortedPostsData();


  return (
    // 页面容器
    <div className="container mx-auto py-12">
        {/* 文章列表组件: showMoreLink=false 表示显示完整列表，启用分页 */}
      <ArticleList 
        articles={allPostsData} 
        showMoreLink={false} 
        enablePagination={true}
        itemsPerPage={50}  // 每页显示50篇文章
      />
    </div>
  )
}

