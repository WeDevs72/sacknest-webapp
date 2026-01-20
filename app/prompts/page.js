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
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center border-2 border-transparent group-hover:border-yellow-400 transition-colors">
                <Sparkles className="w-6 h-6 text-white dark:text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">SackNest</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 font-bold">
              <Link href="/prompts" className="text-black dark:text-white hover:underline decoration-4 decoration-yellow-400 underline-offset-4">
                Browse Prompts
              </Link>
              <Link href="/premium" className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-green-400 underline-offset-4 transition-all">
                Premium Packs
              </Link>
              <Link href="/blog" className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-blue-400 underline-offset-4 transition-all">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-black dark:text-white">
            AI Prompt <span className="text-yellow-400 underline decoration-black dark:decoration-white decoration-4 underline-offset-8">Library</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-bold">
            Browse our collection of battle-tested AI prompts for every platform.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="max-w-5xl mx-auto mb-16 space-y-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
            <Input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 py-8 text-xl border-4 border-black dark:border-white rounded-2xl focus:border-yellow-400 font-bold placeholder:text-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Filter className="text-black dark:text-white w-6 h-6 mr-2" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-6 text-lg font-bold border-2 border-black ${selectedCategory === category ? 'bg-black text-yellow-400' : 'bg-white text-black hover:bg-yellow-100'}`}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2rem] border-2 border-black" />
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border-4 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-2xl text-gray-500 dark:text-gray-400 font-bold">No prompts found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/prompts/${prompt.id}`}>
                  <div className="h-full bg-white dark:bg-gray-900 rounded-[2rem] p-8 border-2 border-black dark:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 cursor-pointer group hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-6">
                      <span className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-gray-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        {prompt.category}
                      </span>
                      {prompt.isPremium && (
                        <span className="bg-yellow-400 text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Star className="w-3 h-3 mr-1 fill-black" />
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black mb-4 group-hover:underline decoration-2 underline-offset-2 uppercase leading-tight line-clamp-2">{prompt.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 font-medium border-l-4 border-gray-200 pl-4 italic">
                      "{prompt.promptText}"
                    </p>
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {prompt.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-md uppercase tracking-wide">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center text-black dark:text-white font-black group-hover:translate-x-2 transition-transform">
                      View Prompt <ArrowRight className="ml-2 w-5 h-5 bg-black text-white rounded-full p-1" />
                    </div>
                  </div>
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
          className="text-center mt-32 bg-yellow-400 rounded-[3rem] p-16 border-4 border-black relative overflow-hidden"
        >
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white rounded-full opacity-20 filter blur-3xl"></div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-black relative z-10">Want Access to Premium Prompts?</h2>
          <p className="text-xl md:text-2xl text-black/80 font-bold mb-10 max-w-3xl mx-auto relative z-10">Get 500+ exclusive prompts used by top creators.</p>
          <Link href="/premium" className="relative z-10">
            <Button size="lg" className="bg-black text-white hover:bg-gray-900 border-2 border-black rounded-full px-12 py-8 text-xl font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              View Premium Packs
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
