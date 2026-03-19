'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowLeft, Clock, BookOpen, ArrowRight, ExternalLink, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import logo from '@/public/logo_header.png'

export default function BlogDetailPage() {
  const params = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeHeading, setActiveHeading] = useState('')

  useEffect(() => {
    if (params.slug) fetchBlog()
  }, [params.slug])

  // Scroll spy for table of contents
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    const headings = document.querySelectorAll('article h2[id]')
    headings.forEach((h) => observer.observe(h))
    return () => headings.forEach((h) => observer.unobserve(h))
  }, [blog])

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

  // Extract headings for table of contents
  const headings = useMemo(() => {
    if (!blog?.contentMarkdown) return []
    const matches = blog.contentMarkdown.match(/^## .+$/gm) || []
    return matches.map((h) => {
      const text = h.replace(/^## /, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return { text, id }
    })
  }, [blog])

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!blog?.contentMarkdown) return 0
    const words = blog.contentMarkdown.split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
  }, [blog])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black dark:border-white border-t-transparent"></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-6 uppercase tracking-tight text-black dark:text-white">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button className="border-2 border-black font-bold">Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image src={logo} alt="SackNest Logo" className="w-10 h-10" />
              <span className="text-2xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                SackNest
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 font-bold">
              <Link href="/prompts" className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-yellow-400 underline-offset-4 transition-all">
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

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b-2 border-black dark:border-white"
      >
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="mb-6 hover:bg-transparent hover:text-yellow-600 pl-0 text-base font-bold group">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Button>
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block mb-6">
                Article
              </span>

              <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-black dark:text-white leading-[1.1]">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {blog.contentMarkdown.split(/\s+/).length} words
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto flex gap-12">

          {/* Table of Contents – Desktop Sidebar */}
          {headings.length > 0 && (
            <aside className="hidden xl:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className={`block text-sm py-2 px-3 rounded-lg transition-all leading-snug ${
                        activeHeading === h.id
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-black dark:text-yellow-300 font-black border-l-4 border-yellow-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 font-medium'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>

                {/* Quick share/nav */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Link href="/prompts">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-yellow-600 transition-colors py-2 cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                      Browse AI Prompts
                    </div>
                  </Link>
                  <Link href="/premium">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-yellow-600 transition-colors py-2 cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                      Premium Packs
                    </div>
                  </Link>
                </div>
              </div>
            </aside>
          )}

          {/* Article Body */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0 max-w-4xl"
          >
            {/* Markdown Content */}
            <div className="blog-content">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => {
                    const text = typeof children === 'string' ? children : 
                      Array.isArray(children) ? children.map(c => typeof c === 'string' ? c : c?.props?.children || '').join('') : ''
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    return (
                      <h2
                        id={id}
                        className="text-2xl md:text-3xl font-black text-black dark:text-white mt-14 mb-5 tracking-tight scroll-mt-24 flex items-center gap-3 group"
                      >
                        <span className="w-1.5 h-8 bg-yellow-400 rounded-full flex-shrink-0" />
                        {children}
                      </h2>
                    )
                  },
                  h3: ({ children }) => (
                    <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mt-10 mb-4 tracking-tight">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-5 font-medium">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-black text-black dark:text-white">
                      {children}
                    </strong>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-yellow-600 dark:hover:text-yellow-400 font-bold underline decoration-2 decoration-blue-200 dark:decoration-blue-800 underline-offset-2 hover:decoration-yellow-400 transition-all inline-flex items-center gap-0.5"
                    >
                      {children}
                      <ExternalLink className="w-3.5 h-3.5 inline-block ml-0.5 opacity-50" />
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-3 my-6 ml-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-3 my-6 ml-1 list-none counter-reset-item">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2.5 flex-shrink-0" />
                      <span>{children}</span>
                    </li>
                  ),
                  hr: () => (
                    <div className="my-10 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                      <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <span className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    </div>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-8 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 pl-6 pr-6 py-4 rounded-r-2xl text-gray-800 dark:text-gray-200 italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded-md font-mono text-pink-600 dark:text-pink-400 border border-gray-200 dark:border-gray-700">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-950 text-gray-100 rounded-2xl p-6 my-8 overflow-x-auto text-sm border-2 border-gray-800">
                      {children}
                    </pre>
                  ),
                }}
              >
                {blog.contentMarkdown || ""}
              </ReactMarkdown>
            </div>

            {/* CTA */}
            <div className="mt-20 pt-12 border-t-2 border-gray-200 dark:border-gray-800">
              <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 rounded-[2rem] p-10 md:p-14 text-black border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white rounded-full opacity-15 blur-3xl" />
                <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-orange-400 rounded-full opacity-20 blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">
                    Ready to Level Up Your Content? 🚀
                  </h3>
                  <p className="text-black/70 font-bold mb-8 text-lg max-w-xl">
                    Get access to 500+ exclusive AI prompts used by top creators and entrepreneurs.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/premium">
                      <Button size="lg" className="bg-black text-white hover:bg-gray-800 border-2 border-black text-base py-5 px-8 rounded-xl font-black uppercase tracking-wide shadow-[3px_3px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                        View Premium Packs
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/prompts">
                      <Button size="lg" variant="outline" className="bg-white/80 hover:bg-white text-black border-2 border-black text-base py-5 px-8 rounded-xl font-black uppercase tracking-wide">
                        Browse Free Prompts
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  )
}
