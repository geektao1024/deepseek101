// components/Layout.js
import { Navigation } from './Navigation'
import { Footer } from '@/components/Footer'
import { getSortedPostsData } from '@/lib/posts'

export function Layout({ children }) {
  const allArticles = getSortedPostsData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation articles={allArticles} />
      <main className="flex-1 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}