// components/Layout.js
import React from 'react'
import { Navigation } from './Navigation'
import { Footer } from '@/components/Footer'
import { getSortedPostsData } from '@/lib/posts'
import Head from 'next/head'

export function Layout({ children }) {
  const allArticles = getSortedPostsData();

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        {/* 移除Google字体的引入 */}
      </Head>
      <Navigation articles={allArticles} />
      <main className="flex-1 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}