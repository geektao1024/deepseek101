'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <div className="mb-4 flex justify-between">
        <Link href="/admin">
          <Button>Back to Admin Dashboard</Button>
        </Link>
        <div>
          <Button onClick={handleSync} className="mr-2">Sync Articles</Button>
          <Link href="/admin/articles/create">
            <Button>Create New Article</Button>
          </Link>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentPageItems().map((article, index) => (
            <TableRow key={index}>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.description}</TableCell>
              <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(article.lastModified).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/admin/articles/edit?path=${encodeURIComponent(article.path)}`}>
                    <Button>Edit</Button>
                  </Link>
                  <Button 
                    onClick={async () => {
                      if(confirm('Are you sure you want to delete this article?')) {
                        try {
                          const response = await fetch('/api/articles/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              path: article.path,  // .md 文件路径
                              title: article.title // 用于日志记录
                            })
                          });

                          if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Failed to delete article');
                          }

                          await fetchArticles(true);  // 传入 true 表示需要从 GitHub 重新同步
                        } catch (error) {
                          console.error('Error deleting article:', error);
                          alert('Failed to delete article: ' + error.message);
                        }
                      }
                    }}
                    variant="destructive"
                  >
                    Delete
                  </Button>
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
        >
          Next
        </Button>
      </div>
    </div>
  );
}