import React from 'react'
import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import { SearchBox } from '@/components/SearchBox'
import { Metadata } from 'next'
import { SearchResults } from '@/components/SearchResults'
import { Sparkles, Zap, Star, Rocket } from 'lucide-react'

// Home component: Main page of the LemoBook website
// Displays website overview, resource list and latest articles
export const metadata: Metadata = {
  title: 'DeepSeek101 - DeepSeek Tool Discovery Platform',
  description: 'Discover and use the best DeepSeek tools to improve your productivity.',
}

export default function Home() {
  // Read tool data
  const toolsPath = path.join(process.cwd(), 'data', 'json', 'tools.json')
  const { categories, tools = [] } = JSON.parse(fs.readFileSync(toolsPath, 'utf8'))
  
  // Get all article data
  const allPostsData = getSortedPostsData()

  return (
    // Main container, using Tailwind classes for layout and spacing
    <div className="container mx-auto py-12 space-y-16">
      {/* Header area: includes website title, subtitle and intro */}
      <section className="text-center py-10 relative">
        {/* Decorative background element */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent rounded-3xl -z-10"></div>
        
        {/* Feature badges positioned at the top */}
        <div className="flex justify-center gap-3 mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            AI-Powered
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Zap className="h-3.5 w-3.5 mr-1" />
            Fast
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Star className="h-3.5 w-3.5 mr-1" />
            Trusted
          </span>
        </div>
        
        {/* Main title: responsive font size settings */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          DeepSeek101
        </h1>
        
        {/* Subtitle with icon */}
        <div className="inline-flex items-center justify-center mb-6">
        <h2 className="text-2xl tracking-tighter sm:text-3xl md:text-3xl lg:text-3xl">
            Discover Quality DeepSeek Tools
        </h2>
          <Rocket className="h-5 w-5 ml-2 text-orange-500" />
        </div>

        {/* Tool count indicator */}
        <div className="mb-8">
          <span className="font-bold text-blue-600">{tools.length}+</span>
          <span className="text-gray-700"> tools found and counting</span>
        </div>

        {/* Search box with enhanced styling */}
        <div className="max-w-2xl mx-auto relative">
          <SearchBox articles={allPostsData} />
        </div>
      </section>

      {/* Search results display - client component */}
      <SearchResults 
        tools={tools} 
        articles={allPostsData} 
        categories={categories} 
      />
    </div>
  )
}