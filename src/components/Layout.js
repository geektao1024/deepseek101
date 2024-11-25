// components/Layout.js
import { Navigation } from './Navigation'
import { Footer } from '@/components/Footer'

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}