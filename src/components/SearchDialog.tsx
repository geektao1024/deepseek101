'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

interface SearchDialogProps {
  articles: Article[];
  onClose: () => void;
}

export function SearchDialog({ articles, onClose }: SearchDialogProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // 处理搜索
  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = articles.filter(article => 
      article.title.toLowerCase().includes(searchLower) ||
      article.description.toLowerCase().includes(searchLower) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
    setResults(filtered);
    setSelectedIndex(0);
  }, [search, articles]);

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            router.push(`/posts/${results[selectedIndex].id}`);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, router, onClose]);

  // 添加滚动到选中项的逻辑
  useEffect(() => {
    const selectedElement = document.getElementById(`search-result-${selectedIndex}`);
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg w-[550px] max-w-[90vw] relative mt-[20vh]">
        <div className="flex items-center p-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-1 outline-none"
            placeholder="Search Articles ..."
            autoFocus
          />
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2 space-y-1">
              {results.map((article, index) => (
                <button
                  key={article.id}
                  id={`search-result-${index}`}
                  onClick={() => {
                    router.push(`/posts/${article.id}`);
                    onClose();
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    selectedIndex === index ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  )}
                >
                  <div className="font-medium">{article.title}</div>
                  {article.description && (
                    <div className="text-gray-500 text-xs line-clamp-1 mt-0.5">
                      {article.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : search ? (
            <div className="text-sm text-gray-500 p-4 text-center">
              未找到相关文章
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 
