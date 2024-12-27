'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  tags: string[];
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}

interface ArticleLayoutProps {
  article: Article;
  allArticles: Article[];
  children: React.ReactNode;
}

export function ArticleLayout({ article, allArticles, children }: ArticleLayoutProps) {
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set(article.tags));

  // 监听滚动，更新当前可见的标题
  useEffect(() => {
    if (!article.headings || article.headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const headingId = entry.target.id.replace('user-content-', '');
            setActiveHeading(headingId);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    article.headings.forEach(heading => {
      const element = document.getElementById(`user-content-${heading.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [article.headings]);

  // 处理目录点击
  const handleTocClick = (headingId: string) => {
    const element = document.getElementById(`user-content-${headingId}`);
    
    if (element) {
      const offset = 80; // 顶部导航栏的高度
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveHeading(headingId);
    }
  };

  // 切换标签展开/折叠
  const toggleTag = (tag: string) => {
    const newExpandedTags = new Set(expandedTags);
    if (newExpandedTags.has(tag)) {
      newExpandedTags.delete(tag);
    } else {
      newExpandedTags.add(tag);
    }
    setExpandedTags(newExpandedTags);
  };

  // 获取当前文章在同一标签下的上一篇和下一篇文章
  const getNavigation = () => {
    // 如果文章没有标签，返回空
    if (!article.tags || article.tags.length === 0) {
      return { prev: null, next: null };
    }

    // 获取当前文章的第一个标签下的所有文章
    const sameTagArticles = allArticles.filter(a => 
      a.tags?.includes(article.tags[0])
    );

    // 找到当前文章在列表中的位置
    const currentIndex = sameTagArticles.findIndex(a => a.id === article.id);

    // 获取上一篇和下一篇文章
    const prev = currentIndex > 0 ? sameTagArticles[currentIndex - 1] : null;
    const next = currentIndex < sameTagArticles.length - 1 ? sameTagArticles[currentIndex + 1] : null;

    return { prev, next };
  };

  const { prev, next } = getNavigation();

  return (
    <div className="container mx-auto px-4 relative">
      <div className="flex gap-8 py-8">
        {/* 左侧边栏 - 移除折叠功能 */}
        <aside className="w-64 shrink-0 border-r border-gray-200">
          <div className="sticky top-24 space-y-6 pr-4">
            {article.tags?.map(tag => (
              <div key={tag} className="space-y-2">
                <button
                  onClick={() => toggleTag(tag)}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>{tag}</span>
                  <span className="text-xs text-gray-500">
                    ({allArticles.filter(a => a.tags?.includes(tag)).length})
                    {expandedTags.has(tag) ? (
                      <ChevronDown className="h-4 w-4 inline ml-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 inline ml-1" />
                    )}
                  </span>
                </button>

                {expandedTags.has(tag) && (
                  <ul className="space-y-1 pl-4 border-l border-gray-100">
                    {allArticles
                      .filter(a => a.tags?.includes(tag))
                      .map(a => (
                        <li key={a.id}>
                          <Link
                            href={`/posts/${a.id}`}
                            className={cn(
                              "block text-sm py-1 px-2 rounded-md transition-colors",
                              a.id === article.id
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            )}
                          >
                            {a.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0">
          <article className="prose prose-lg max-w-none">
            {children}
          </article>

          {/* 文章导航 */}
          <nav className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                {/* 上一篇 */}
                {prev ? (
                  <Link
                    href={`/posts/${prev.id}`}
                    className="group flex flex-col items-start max-w-[45%]"
                  >
                    <span className="text-sm text-gray-500 mb-1">← Previous Article</span>
                    <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/posts"
                    className="group flex flex-col items-start"
                  >
                    <span className="text-sm text-gray-500 mb-1">←</span>
                    <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Back to Articles
                    </span>
                  </Link>
                )}

                {/* 下一篇 */}
                {next ? (
                  <Link
                    href={`/posts/${next.id}`}
                    className="group flex flex-col items-end text-right max-w-[45%]"
                  >
                    <span className="text-sm text-gray-500 mb-1">Next Article →</span>
                    <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/posts"
                    className="group flex flex-col items-end text-right"
                  >
                    <span className="text-sm text-gray-500 mb-1">→</span>
                    <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Back to Articles
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </main>

        {/* 右侧目录 - 优化后的设计 */}
        <aside className="w-64 shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* 目录标题栏 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-medium text-gray-900">Table of Contents</h3>
                <button
                  onClick={() => setIsTocCollapsed(!isTocCollapsed)}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {isTocCollapsed ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* 目录内容 */}
              <nav
                className={cn(
                  "space-y-1 overflow-hidden transition-all duration-300",
                  isTocCollapsed ? "max-h-0 opacity-0" : "max-h-[calc(100vh-12rem)] opacity-100"
                )}
              >
                <div className="p-2">
                  {article.headings?.map(heading => (
                    <button
                      key={heading.id}
                      onClick={() => handleTocClick(heading.id)}
                      className={cn(
                        "w-full text-left text-sm py-1.5 px-2 rounded-md transition-all duration-200",
                        "hover:bg-blue-50/80 hover:text-blue-700",
                        activeHeading === heading.id
                          ? "bg-blue-100 text-blue-800 font-medium shadow-sm"
                          : "text-gray-600",
                        {
                          "pl-0": heading.level === 1,
                          "pl-4": heading.level === 2,
                          "pl-6": heading.level === 3,
                          "pl-8": heading.level === 4,
                          "pl-10": heading.level === 5,
                          "pl-12": heading.level === 6
                        }
                      )}
                    >
                      {heading.text}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 