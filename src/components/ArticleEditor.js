'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ArticleEditor() {
  const [article, setArticle] = useState({
    title: '',
    description: '',
    content: '',
    coverImage: '',
    tags: '',
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();
  const path = searchParams.get('path');

  const fetchArticle = async (path) => {
    try {
      const response = await fetch(`/api/articles?path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error('Failed to fetch article');
      const data = await response.json();
      setArticle({
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : ''
      });
      setIsDirty(false);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  const saveArticle = async (articleData) => {
    const processedArticle = {
      ...articleData,
      tags: articleData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: processedArticle, path })
    });
    if (!response.ok) throw new Error('Failed to save article');
    return response.json();
  };

  useEffect(() => {
    if (path) {
      fetchArticle(path);
    }
  }, [path]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveArticle(article);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to discard all changes?')) {
      fetchArticle(path);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Title
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Input
          name="title"
          value={article.title}
          onChange={handleChange}
          placeholder="Enter article title"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          name="description"
          value={article.description}
          onChange={handleChange}
          placeholder="Enter article description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Cover Image URL
          <span className="text-gray-500 text-xs ml-2">(Optional)</span>
        </label>
        <Input
          name="coverImage"
          value={article.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Tags
          <span className="text-gray-500 text-xs ml-2">(Comma separated)</span>
        </label>
        <Input
          name="tags"
          value={article.tags}
          onChange={handleChange}
          placeholder="nextjs, react, tutorial"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Content
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Textarea
          name="content"
          value={article.content}
          onChange={handleChange}
          placeholder="Write your article content here (Markdown supported)"
          rows={20}
          className="font-mono"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={!isDirty || isSaving ? 'opacity-50' : ''}
        >
          {isSaving ? 'Saving...' : 'Save Article'}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          disabled={!isDirty || isSaving}
        >
          Reset Changes
        </Button>
      </div>
    </div>
  );
}