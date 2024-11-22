'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

export default function CreateArticlePage() {
  const [article, setArticle] = useState({
    title: '',
    description: '',
    content: '',
    slug: '',
    coverImage: '',
    tags: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    const processedArticle = {
      ...article,
      tags: article.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      const response = await fetch('/api/articles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedArticle),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create article');
      }

      router.push('/admin/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Article</h1>
        <Link href="/admin/articles">
          <Button variant="outline">Back to Articles</Button>
        </Link>
      </div>

      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

      <div className="space-y-6">
        {/* 文章标题 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Title
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            name="title"
            value={article.title}
            onChange={handleInputChange}
            placeholder="Enter article title"
            required
          />
        </div>

        {/* 文章描述 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            name="description"
            value={article.description}
            onChange={handleInputChange}
            placeholder="Enter article description"
            rows={3}
          />
        </div>

        {/* 新增：封面图片 URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Cover Image URL
            <span className="text-gray-500 text-xs ml-2">(Optional)</span>
          </label>
          <Input
            name="coverImage"
            value={article.coverImage}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* 新增：文章标签 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tags
            <span className="text-gray-500 text-xs ml-2">(Comma separated)</span>
          </label>
          <Input
            name="tags"
            value={article.tags}
            onChange={handleInputChange}
            placeholder="nextjs, react, tutorial"
          />
        </div>

        {/* 文件名 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            File Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            name="slug"
            value={article.slug}
            onChange={handleInputChange}
            placeholder="e.g., getting-started-with-lemobook"
            required
          />
        </div>

        {/* 文章内容 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Content
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Textarea
            name="content"
            value={article.content}
            onChange={handleInputChange}
            placeholder="Write your article content here (Markdown supported)"
            rows={20}
            className="font-mono"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className={isLoading ? 'opacity-50' : ''}
          >
            {isLoading ? 'Creating...' : 'Create Article'}
          </Button>
        </div>
      </div>
    </div>
  );
}