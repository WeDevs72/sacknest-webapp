// Server Component — no 'use client' directive.
// All prompt data is fetched at build time via Supabase, then rendered as static HTML.
// Interactive search/filter is handled by the PromptsSearchClient child component.

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Sparkles, Menu, ArrowRight } from 'lucide-react'
import PromptsSearchClient from '@/components/PromptsSearchClient'
import { getAllPrompts, getAllCategories } from '@/lib/prompts-data'
import logo from '@/public/logo_header.png'

// ISR: rebuild this page at most once per hour so new prompts appear without a full redeploy
export const revalidate = 3600

export default async function PromptsPage() {
  const [prompts, categories] = await Promise.all([
    getAllPrompts(),
    getAllCategories(),
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image src={logo} alt="SackNest Logo" className="w-10 h-10" />
              <span className="text-3xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                SackNest
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8 font-bold">
              <Link
                href="/prompts"
                className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-yellow-400 underline-offset-4 transition-all"
              >
                Browse Prompts
              </Link>
              <Link
                href="/premium"
                className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-green-400 underline-offset-4 transition-all"
              >
                Premium Packs
              </Link>
              <Link
                href="/blog"
                className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-blue-400 underline-offset-4 transition-all"
              >
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header — fully static, indexed by Google */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-black dark:text-white">
            AI Prompt{' '}
            <span className="text-yellow-400 underline decoration-black dark:decoration-white decoration-4 underline-offset-8">
              Library
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-bold">
            Browse our collection of {prompts.length}+ battle-tested AI prompts for every platform.
          </p>
        </div>

        {/* Static prompt count summary for SEO */}
        <p className="sr-only">
          Showing {prompts.length} AI prompts across {categories.length} categories including{' '}
          {categories.slice(0, 5).join(', ')}.
        </p>

        {/* Interactive search + grid — client component receives all data as props */}
        <PromptsSearchClient prompts={prompts} categories={categories} />
      </main>

      {/* CTA Section */}
      <div className="text-center mt-32 bg-yellow-400 rounded-[3rem] p-16 m-8 border-4 border-black relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white rounded-full opacity-20 filter blur-3xl" />
        <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-black relative z-10">
          Want Access to Premium Prompts?
        </h2>
        <p className="text-xl md:text-2xl text-black/80 font-bold mb-10 max-w-3xl mx-auto relative z-10">
          Get 500+ exclusive prompts used by top creators.
        </p>
        <Link href="/premium" className="relative z-10">
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-900 border-2 border-black rounded-full px-12 py-8 text-xl font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            View Premium Packs <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
