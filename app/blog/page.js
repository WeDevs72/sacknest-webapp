'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Calendar, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      if (Array.isArray(data)) {
        setBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

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
              <Link href="/prompts" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                Browse Prompts
              </Link>
              <Link href="/premium" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                Premium Packs
              </Link>
              <Link href="/blog" className="text-purple-600 dark:text-purple-400 font-semibold">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Blog & Resources
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn about AI, prompt engineering, and content creation strategies
          </p>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${blog.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700">
                    <CardContent className="p-6">
                      <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        Article
                      </Badge>
                      <h2 className="text-2xl font-bold mb-3 line-clamp-2">{blog.title}</h2>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                        {blog.contentMarkdown.substring(0, 150)}...
                      </p>
                      <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                        Read More <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
