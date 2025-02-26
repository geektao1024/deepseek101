'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Search, X } from 'lucide-react'
import { SearchDialog } from '@/components/SearchDialog'
import { Input } from "@/components/ui/input"

interface Article {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

interface SearchBoxProps {
  articles: Article[];
}

export function SearchBox({ articles }: SearchBoxProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Use ⌘K shortcut to open the search dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowDialog(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Execute search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    
    const term = searchTerm.toLowerCase()
    const filtered = articles.filter(article => 
      article.title.toLowerCase().includes(term) ||
      article.description.toLowerCase().includes(term) ||
      article.tags?.some(tag => tag.toLowerCase().includes(term))
    )
    
    setSearchResults(filtered)
    setIsSearching(true)
  }
  
  // Search when the search term changes and user presses Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  // Clear search
  const handleClear = () => {
    setSearchTerm('')
    setSearchResults([])
    setIsSearching(false)
  }

  return (
    <>
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="relative">
          <div className="flex">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tools, articles and resources..."
                className="h-12 pl-10 pr-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button 
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              className="ml-2 h-12" 
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
        
        {/* Search results count */}
        {isSearching && (
          <div className="mt-4 text-sm text-gray-500">
            Found {searchResults.length} results
            {searchTerm && <span> for &ldquo;{searchTerm}&rdquo;</span>}
          </div>
        )}
      </div>

      {/* Send search results to parent component */}
      <input 
        type="hidden" 
        id="search-results-data" 
        value={JSON.stringify({
          term: searchTerm,
          isSearching,
          count: searchResults.length,
          articleIds: searchResults.map(article => article.id)
        })}
      />

      {/* Search dialog - when using keyboard shortcut */}
      {showDialog && (
        <SearchDialog articles={articles} onClose={() => setShowDialog(false)} />
      )}
    </>
  )
} 