'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Calendar, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'

export default function BlogDetailPage() {
  const params = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchBlog()
    }
  }, [params.slug])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setBlog(data)
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-purple-200 dark:border-purple-800">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">SackNest</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            Article
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {blog.title}
          </h1>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-8">
            <Calendar className="w-5 h-5 mr-2" />
            {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{blog.contentMarkdown}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-200 dark:border-purple-800">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Level Up Your Content?</h3>
              <p className="mb-6 opacity-90">Get instant access to 500+ AI prompts</p>
              <Link href="/premium">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  View Premium Packs
                </Button>
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}
