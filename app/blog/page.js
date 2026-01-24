'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Calendar, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import logo from '@/public/logo_header.png'


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
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image src={logo} alt="SackNest Logo" className="w-10 h-10" />

              <span className="text-2xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">SackNest</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 font-bold">
              <Link href="/prompts" className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-yellow-400 underline-offset-4 transition-all">
                Browse Prompts
              </Link>
              <Link href="/premium" className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-green-400 underline-offset-4 transition-all">
                Premium Packs
              </Link>
              <Link href="/blog" className="text-black dark:text-white hover:underline decoration-4 decoration-blue-400 underline-offset-4">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter text-black dark:text-white">
            Blog & <span className="text-blue-400 underline decoration-black dark:decoration-white decoration-4 underline-offset-8">Resources</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-bold">
            Learn about AI, prompt engineering, and content creation strategies.
          </p>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2rem] border-2 border-black" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border-4 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-2xl text-gray-500 dark:text-gray-400 font-bold">No blog posts yet. Check back soon!</p>
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
                  <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-[2rem] p-8 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-none transition-all duration-200 cursor-pointer">
                    <div className="mb-6">
                      <span className="bg-blue-100 text-blue-700 border-2 border-blue-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        Article
                      </span>
                    </div>

                    <h2 className="text-2xl font-black mb-4 line-clamp-2 uppercase leading-tight">{blog.title}</h2>

                    <div className="flex items-center text-sm font-bold text-gray-400 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 font-medium flex-grow">
                      {blog.contentMarkdown.substring(0, 150)}...
                    </p>

                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-black mt-auto uppercase tracking-wide group">
                      Read More <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
