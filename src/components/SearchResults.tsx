'use client'

import React, { useState, useEffect } from 'react'
import ToolList from '@/components/ToolList'
import ArticleList from '@/components/ArticleList'

interface Article {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
  rating: {
    score: number;
    count: number;
  };
  stars?: number;
  forks?: number;
  views?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface SearchResultsProps {
  tools: Tool[];
  articles: Article[];
  categories: Category[];
  github_stats_updated_at?: string;
}

interface SearchState {
  term: string;
  isSearching: boolean;
  count: number;
  articleIds: string[];
}

export function SearchResults({ tools, articles, categories, github_stats_updated_at }: SearchResultsProps) {
  const [searchState, setSearchState] = useState<SearchState>({
    term: '',
    isSearching: false,
    count: 0,
    articleIds: []
  })
  
  // 将github_stats_updated_at添加到工具数组的每个工具，创建一个新的数组
  // 这样每个工具都会拥有正确的GitHub统计数据
  console.log('SearchResults received github_stats_updated_at:', github_stats_updated_at);
  console.log('Tools count before processing:', tools.length);
  console.log('First tool before processing:', tools[0]);
  
  // Listen for search result changes
  useEffect(() => {
    const checkForSearchResults = () => {
      const searchDataElement = document.getElementById('search-results-data') as HTMLInputElement
      if (searchDataElement) {
        try {
          const searchData = JSON.parse(searchDataElement.value) as SearchState
          setSearchState(searchData)
        } catch (error) {
          console.error('Search data parsing error:', error)
        }
      }
    }
    
    // Initial check
    checkForSearchResults()
    
    // Set up observer to monitor data changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' && 
          mutation.attributeName === 'value' &&
          mutation.target.nodeName === 'INPUT'
        ) {
          checkForSearchResults()
        }
      })
    })
    
    const searchDataElement = document.getElementById('search-results-data')
    if (searchDataElement) {
      observer.observe(searchDataElement, { attributes: true })
    }
    
    return () => observer.disconnect()
  }, [])
  
  // Filter tools and articles
  const filteredTools = !searchState.isSearching 
    ? tools 
    : tools.filter(tool => {
        const term = searchState.term.toLowerCase()
        return (
          tool.name.toLowerCase().includes(term) ||
          tool.description.toLowerCase().includes(term) ||
          tool.tags.some(tag => tag.toLowerCase().includes(term))
        )
      })
  
  const filteredArticles = !searchState.isSearching
    ? articles
    : articles.filter(article => searchState.articleIds.includes(article.id))
  
  // If no search, display default content
  if (!searchState.isSearching) {
    return (
      <>
        {/* Tool navigation */}
        <ToolList 
          categories={categories} 
          tools={tools} 
        />
        
        {/* Article list component: display the latest 12 articles, no pagination */}
        <ArticleList 
          articles={articles} 
          showMoreLink={true} 
          enablePagination={false}
        />
      </>
    )
  }
  
  // Display search results
  return (
    <div className="space-y-12">
      {/* Tool search results */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Tool Search Results</h2>
        {filteredTools.length > 0 ? (
          <ToolList 
            categories={categories} 
            tools={filteredTools} 
          />
        ) : (
          <p className="text-gray-500 py-8 text-center">No matching tools found</p>
        )}
      </section>
      
      {/* Article search results */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Article Search Results</h2>
        {filteredArticles.length > 0 ? (
          <ArticleList 
            articles={filteredArticles} 
            showMoreLink={false} 
            enablePagination={false}
          />
        ) : (
          <p className="text-gray-500 py-8 text-center">No matching articles found</p>
        )}
      </section>
    </div>
  )
} 