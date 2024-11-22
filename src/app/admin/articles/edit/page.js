'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

const ArticleEditor = dynamic(() => import('@/components/ArticleEditor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

export default function ArticleEditorPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <AuthWrapper>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Article</h1>
          <Link href="/admin/articles">
            <Button variant="outline">Back to Articles</Button>
          </Link>
        </div>
        <ArticleEditor />
      </div>
    </AuthWrapper>
  );
}