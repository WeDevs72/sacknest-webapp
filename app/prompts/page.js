'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Search, Filter, ArrowRight, Star } from 'lucide-react'

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrompts()
    fetchCategories()
  }, [selectedCategory])

  const fetchPrompts = async () => {
    setLoading(true)
    try {
      const url = selectedCategory === 'all' 
        ? '/api/prompts' 
        : `/api/prompts?category=${encodeURIComponent(selectedCategory)}`
      
      const response = await fetch(url)
      const data = await response.json()
      if (Array.isArray(data)) {
        setPrompts(data)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (Array.isArray(data)) {
        setCategories(['all', ...data])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-purple-200 dark:border-purple-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">SackNest</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/prompts" className="text-purple-600 dark:text-purple-400 font-semibold">
                Browse Prompts
              </Link>
              <Link href="/premium" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                Premium Packs
              </Link>
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI Prompt Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our collection of battle-tested AI prompts for every platform
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="text-gray-500 w-5 h-5" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : ''}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">No prompts found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/prompts/${prompt.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          {prompt.category}
                        </Badge>
                        {prompt.isPremium && (
                          <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{prompt.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                        {prompt.promptText}
                      </p>
                      {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {prompt.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-semibold">
                        View Prompt <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Want Access to Premium Prompts?</h2>
          <p className="text-lg mb-6 opacity-90">Get 500+ exclusive prompts used by top creators</p>
          <Link href="/premium">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              View Premium Packs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
