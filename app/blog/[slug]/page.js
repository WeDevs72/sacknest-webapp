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
    if (params.slug) fetchBlog()
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
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black dark:border-white"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-6 uppercase tracking-tight text-black dark:text-white">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button className="border-2 border-black">Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center border-2 border-transparent group-hover:border-yellow-400 transition-colors">
              <Sparkles className="w-6 h-6 text-white dark:text-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
              SackNest
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 hover:bg-transparent hover:text-yellow-600 pl-0 text-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <span className="bg-blue-100 text-blue-700 border-2 border-blue-200 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">
            Article
          </span>

          <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-black dark:text-white leading-[1.1]">
            {blog.title}
          </h1>

          <div className="flex items-center text-gray-500 font-bold uppercase tracking-wide mb-10 pb-10 border-b-4 border-black border-dashed">
            <Calendar className="w-5 h-5 mr-2" />
            {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
          </div>

          {/* Markdown Content */}
          <div
            className="
            prose prose-xl dark:prose-invert max-w-none text-gray-800 dark:text-gray-200
        
            /* Real H2 styling */
            prose-h2:text-3xl
            prose-h2:font-black
            prose-h2:uppercase
            prose-h2:tracking-tight
            prose-h2:decoration-yellow-400
            prose-h2:underline-offset-4
            prose-h2:text-black
            prose-h2:dark:text-white
            prose-h2:mt-12
            prose-h2:mb-6
        
            /* Bold paragraph headings */
            prose-strong:font-black
            prose-strong:text-black
            prose-strong:dark:text-white
            
            prose-p:font-medium
            prose-p:leading-loose
          "
          >
            <ReactMarkdown>
              {blog.contentMarkdown || ""}
            </ReactMarkdown>
          </div>

          {/* CTA */}
          <div className="mt-16 pt-12 border-t-4 border-black dark:border-white">
            <div className="bg-yellow-400 rounded-[2.5rem] p-12 text-black text-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">
                Ready to Level Up Your Content?
              </h3>

              <Link href="/premium">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 border-2 border-black text-xl py-6 px-10 rounded-xl font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
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
