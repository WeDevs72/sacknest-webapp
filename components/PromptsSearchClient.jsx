'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Search, ArrowRight, Star } from 'lucide-react'

/**
 * Client component that handles search + category filtering for the /prompts index page.
 * Receives the full prompts list and all categories as props (rendered as static HTML
 * at build time by the parent Server Component).
 *
 * No client-side fetching — all data is already in the page.
 */
export default function PromptsSearchClient({ prompts, categories }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filtered = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider border-2 transition-all ${
              selectedCategory === cat
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]'
                : 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 py-4 text-lg border-4 border-black dark:border-white rounded-2xl focus:border-yellow-400 font-bold placeholder:text-gray-400 w-full"
        />
      </div>

      {/* Prompt Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border-4 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-2xl text-gray-500 dark:text-gray-400 font-bold">
            No prompts found. Try a different search.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((prompt, idx) => (
              <motion.div
                key={prompt.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link href={`/prompts/${prompt.id}`}>
                  <div className="h-full bg-white dark:bg-gray-900 rounded-[2rem] p-8 border-2 border-black dark:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 cursor-pointer group hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-6">
                      <span className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-gray-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        {prompt.category}
                      </span>
                      {prompt.isPremium && (
                        <span className="bg-yellow-400 text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Star className="w-3 h-3 mr-1 fill-black" /> Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black mb-4 group-hover:underline decoration-2 underline-offset-2 uppercase leading-tight line-clamp-2">
                      {prompt.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 font-medium border-l-4 border-gray-200 pl-4 italic">
                      &ldquo;{prompt.promptText}&rdquo;
                    </p>
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {prompt.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-md uppercase tracking-wide"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center text-black dark:text-white font-black group-hover:translate-x-2 transition-transform">
                      View Prompt{' '}
                      <ArrowRight className="ml-2 w-5 h-5 bg-black text-white dark:bg-white dark:text-black rounded-full p-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
