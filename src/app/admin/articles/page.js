'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  RefreshCw,      // 同步按钮图标
  PlusCircle,     // 创建新文章按钮图标
  Edit2,          // 编辑按钮图标
  Trash2,         // 删除按钮图标
  ChevronLeft,    // 上一页按钮图标
  ChevronRight    // 下一页按钮图标
} from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 每页显示10条记录
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/check-auth');
      const data = await response.json();
      if (!data.isLoggedIn) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchArticles = useCallback(async (sync = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articles${sync ? '?sync=true' : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchArticles();
  }, [checkAuth, fetchArticles]);

  const handleSync = useCallback(() => {
    fetchArticles(true);
  }, [fetchArticles]);

  // 计算当前页的文章
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return articles.slice(startIndex, endIndex);
  };

  // 计算总页数
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  if (isLoading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Management</h1>
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={handleSync} 
          className="mr-2"
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Sync Articles
        </Button>
        <Link href="/admin/articles/create">
          <Button icon={<PlusCircle className="h-4 w-4" />}>
            Create New Article
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Title</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead className="w-[120px]">Created</TableHead>
            <TableHead className="w-[150px]">Last Modified</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentPageItems().map((article, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="truncate" title={article.title}>
                  {article.title}
                </div>
              </TableCell>
              <TableCell>
                <div className="truncate" title={article.description}>
                  {article.description}
                </div>
              </TableCell>
              <TableCell>
                <div className="truncate" title={new Date(article.date).toLocaleDateString()}>
                  {new Date(article.date).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="truncate" title={new Date(article.lastModified).toLocaleString()}>
                  {new Date(article.lastModified).toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 whitespace-nowrap">
                  <Link href={`/admin/articles/edit?path=${encodeURIComponent(article.path)}`}>
                    <Button icon={<Edit2 className="h-4 w-4" />} />
                  </Link>
                  <Button 
                    onClick={async () => {
                      if(confirm('Are you sure you want to delete this article?')) {
                        try {
                          await fetch('/api/articles/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ path: article.path, title: article.title })
                          });
                          await fetchArticles(true);
                        } catch (error) {
                          console.error('Error deleting article:', error);
                          alert('Failed to delete article: ' + error.message);
                        }
                      }
                    }}
                    variant="destructive"
                    icon={<Trash2 className="h-4 w-4" />}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 分页控制 */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          icon={<ChevronLeft className="h-4 w-4" />}
        >
          Previous
        </Button>
        <span className="py-2 px-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          icon={<ChevronRight className="h-4 w-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}