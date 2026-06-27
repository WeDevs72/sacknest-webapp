// Server Component — no 'use client' directive.
// generateStaticParams pre-renders one HTML page per prompt at build time.
// generateMetadata sets unique <title> and <meta description> for each prompt.

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Star, ArrowLeft, ArrowRight, Tag, Layers } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import CopyPromptButton from '@/components/CopyPromptButton'
import { getAllPrompts, getPromptById, getRelatedPrompts } from '@/lib/prompts-data'

// ISR: rebuild each prompt page at most once per hour
export const revalidate = 3600

// ---------------------------------------------------------------------------
// generateStaticParams — tells Next.js which slugs to pre-render at build time
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const prompts = await getAllPrompts()
  return prompts.map((prompt) => ({ slug: prompt.id }))
}

// ---------------------------------------------------------------------------
// Meta description & platform formatting helpers
// ---------------------------------------------------------------------------
const PLATFORM_NAMES = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  x: 'X',
  facebook: 'Facebook',
  pinterest: 'Pinterest',
}

const COMMON_START_VERBS = new Set([
  'get', 'generate', 'create', 'write', 'build', 'plan', 'design', 
  'make', 'craft', 'adapt', 'optimize', 'analyze', 'boost', 'improve', 
  'land', 'pitch', 'find', 'run', 'grow', 'master', 'learn', 'use',
  'discover', 'plan', 'organize'
])

function getPlatformName(p) {
  if (!p) return 'AI'
  const clean = p.replace(/-/g, ' ')
  const low = clean.toLowerCase()
  if (PLATFORM_NAMES[low]) return PLATFORM_NAMES[low]
  return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatMetaDescription(prompt) {
  if (!prompt) return ''
  const title = prompt.title || ''
  const platformName = getPlatformName(prompt.platform || prompt.tags?.[0])

  let whatItDoes = (prompt.seoDescription || prompt.title).trim()
  if (whatItDoes.endsWith('.')) {
    whatItDoes = whatItDoes.slice(0, -1)
  }

  // Determine if we need to prepend a verb for grammatical completeness
  const words = whatItDoes.split(/\s+/)
  const firstWord = words[0] ? words[0].toLowerCase() : ''
  
  const startsWithVerb = COMMON_START_VERBS.has(firstWord) || firstWord.endsWith('ing')

  if (startsWithVerb) {
    if (words[0] !== firstWord) {
      if (words[0] !== words[0].toUpperCase()) {
        whatItDoes = words[0].charAt(0).toLowerCase() + words[0].slice(1) + whatItDoes.slice(words[0].length)
      }
    }
  } else {
    // Prepend a suitable verb
    let verb = 'generate'
    const lowTitle = title.toLowerCase()
    const lowWhat = whatItDoes.toLowerCase()
    if (lowTitle.includes('email') || lowTitle.includes('template') || lowWhat.includes('template')) {
      verb = 'get'
    } else if (lowTitle.includes('calendar') || lowTitle.includes('planner')) {
      verb = 'create'
    } else if (lowTitle.includes('writer') || lowTitle.includes('copywriting')) {
      verb = 'write'
    } else if (lowTitle.includes('idea') || lowTitle.includes('generator')) {
      verb = 'generate'
    }
    
    if (words[0] && words[0] !== words[0].toUpperCase()) {
      whatItDoes = words[0].charAt(0).toLowerCase() + words[0].slice(1) + whatItDoes.slice(words[0].length)
    }
    
    whatItDoes = `${verb} ${whatItDoes}`
  }

  const part1 = `${title} – Free AI prompt for ${platformName}.`
  const part2Base = `Use this ChatGPT prompt to `
  const part3 = `Copy, paste & create content instantly.`
  const part4 = `Part of SackNest's free AI prompt library.`

  const candidates = [
    {
      build: (wid) => `${part1} ${part2Base}${wid}. ${part3} ${part4}`,
    },
    {
      build: (wid) => `${part1} ${part2Base}${wid}. ${part3}`,
    },
    {
      build: (wid) => `${part1} ${part2Base}${wid}. ${part4}`,
    },
    {
      build: (wid) => `${part1} ${part2Base}${wid}.`,
    }
  ]

  for (const cand of candidates) {
    const desc = cand.build(whatItDoes)
    if (desc.length >= 130 && desc.length <= 155) {
      return desc
    }
  }

  for (const cand of candidates) {
    const dummyEmpty = cand.build('')
    const baseLen = dummyEmpty.length
    
    const maxWidLen = 155 - baseLen
    const minWidLen = 130 - baseLen

    if (maxWidLen >= 10) {
      let truncatedWid = whatItDoes
      if (truncatedWid.length > maxWidLen) {
        truncatedWid = truncatedWid.slice(0, maxWidLen - 1).trim() + '…'
      }
      const desc = cand.build(truncatedWid)
      if (desc.length >= 130 && desc.length <= 155) {
        return desc
      }
    }
  }

  let shortTitle = title
  if (shortTitle.length > 30) {
    shortTitle = shortTitle.slice(0, 27).trim() + '…'
  }
  const fallbackPart1 = `${shortTitle} – Free AI prompt for ${platformName}.`
  const baseLenD = `${fallbackPart1} ${part2Base}.`.length
  const allowedWidLen = 152 - baseLenD
  let shortWid = whatItDoes
  if (shortWid.length > allowedWidLen) {
    shortWid = shortWid.slice(0, Math.max(5, allowedWidLen - 1)).trim() + '…'
  }
  const finalDesc = `${fallbackPart1} ${part2Base}${shortWid}.`
  if (finalDesc.length < 130) {
    return (finalDesc + ` ${part3}`).slice(0, 155)
  }
  return finalDesc.slice(0, 155)
}

// ---------------------------------------------------------------------------
// generateMetadata — unique <title> and <meta description> per prompt
// Format: "[Prompt Name] - Free AI Prompt | SackNest"
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }) {
  const { slug } = await params
  const prompt = await getPromptById(slug)

  if (!prompt) {
    return {
      title: 'Prompt Not Found | SackNest',
      description: 'This prompt could not be found in the SackNest library.',
    }
  }

  const title =
    prompt.seoTitle || `${prompt.title} - Free AI Prompt | SackNest`
  const description = formatMetaDescription(prompt)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://sacknest.com/prompts/${prompt.id}`,
      siteName: 'SackNest',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://sacknest.com/prompts/${prompt.id}`,
    },
  }
}

// ---------------------------------------------------------------------------
// JSON-LD schema helpers
// ---------------------------------------------------------------------------
function buildJsonLd(prompt) {
  const baseUrl = 'https://sacknest.com'
  const url = `${baseUrl}/prompts/${prompt.id}`
  const description = formatMetaDescription(prompt)

  const keywords = [
    prompt.platform,
    prompt.category,
    ...(prompt.tags || []),
  ]
    .filter(Boolean)
    .join(', ')

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: prompt.title,
    description: description,
    author: {
      '@type': 'Organization',
      name: 'SackNest',
      url: baseUrl,
    },
    url: url,
    keywords: keywords,
    publisher: {
      '@type': 'Organization',
      name: 'SackNest',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo_header.png`,
      },
    },
  }

  return JSON.stringify(schema)
}


// ---------------------------------------------------------------------------
// Platform colour map — makes platform tags visually distinct
// ---------------------------------------------------------------------------
const PLATFORM_COLORS = {
  instagram: 'bg-pink-100 text-pink-800 border-pink-400',
  youtube: 'bg-red-100 text-red-800 border-red-400',
  tiktok: 'bg-slate-100 text-slate-800 border-slate-400',
  linkedin: 'bg-blue-100 text-blue-800 border-blue-400',
  twitter: 'bg-sky-100 text-sky-800 border-sky-400',
  x: 'bg-sky-100 text-sky-800 border-sky-400',
  facebook: 'bg-indigo-100 text-indigo-800 border-indigo-400',
  pinterest: 'bg-rose-100 text-rose-800 border-rose-400',
  default: 'bg-gray-100 text-gray-800 border-gray-300',
}

function getPlatformClasses(platform) {
  if (!platform) return PLATFORM_COLORS.default
  return PLATFORM_COLORS[platform.toLowerCase()] || PLATFORM_COLORS.default
}

// ---------------------------------------------------------------------------
// Page component — fully rendered as static HTML at build time
// ---------------------------------------------------------------------------
export default async function PromptPage({ params }) {
  const { slug } = await params
  const prompt = await getPromptById(slug)

  if (!prompt) {
    notFound()
  }

  const relatedPrompts = await getRelatedPrompts(prompt, 4)

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLd(prompt) }}
      />

      <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center border-2 border-transparent group-hover:border-yellow-400 transition-colors">
                  <Sparkles className="w-6 h-6 text-white dark:text-black" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  SackNest
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-8 font-bold">
                <Link
                  href="/prompts"
                  className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-yellow-400 underline-offset-4 transition-all"
                >
                  ← Browse All Prompts
                </Link>
                <Link
                  href="/premium"
                  className="bg-yellow-400 text-black border-2 border-black px-4 py-2 rounded-full text-sm font-black uppercase tracking-wide hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  Premium Packs ✨
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Breadcrumb + back button */}
          <div className="flex items-center gap-2 mb-8 text-sm font-bold text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/prompts" className="hover:text-black dark:hover:text-white transition-colors">Prompts</Link>
            <span>/</span>
            <span className="text-black dark:text-white truncate max-w-[200px]">{prompt.title}</span>
          </div>

          <div className="max-w-4xl mx-auto">

            {/* ── Prompt header ── */}
            <div className="mb-8">
              {/* Platform + Category badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Platform tag */}
                {prompt.platform && (
                  <span
                    className={`inline-flex items-center gap-1.5 border-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] ${getPlatformClasses(prompt.platform)}`}
                  >
                    <Tag className="w-3 h-3" />
                    {prompt.platform}
                  </span>
                )}

                {/* Category label */}
                <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-2 border-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Layers className="w-3 h-3" />
                  {prompt.category}
                </span>

                {/* Premium badge */}
                {prompt.isPremium && (
                  <span className="inline-flex items-center bg-yellow-400 text-black border-2 border-black px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Star className="w-3 h-3 mr-1 fill-black" />
                    Premium
                  </span>
                )}
              </div>

              {/* H1 — prompt title */}
              <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter text-black dark:text-white leading-[1.1]">
                {prompt.title}
              </h1>

              {/* Tags */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-sm font-bold bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 px-3 py-1 rounded-lg uppercase tracking-wide"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Prompt Card ── */}
            <Card className="mb-10 border-4 border-black dark:border-white rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <CardHeader className="bg-gray-100 dark:bg-gray-900 border-b-4 border-black flex flex-row items-center justify-between p-6">
                <CardTitle className="text-xl font-black uppercase tracking-wide">📋 The Prompt</CardTitle>
                {/* Client component: copy to clipboard */}
                <CopyPromptButton promptText={prompt.promptText} />
              </CardHeader>
              <CardContent className="p-8">
                {/*
                  promptText is rendered in both a visible <p> AND a <pre> for full SEO crawlability.
                  Googlebot reads the text content directly from the DOM.
                */}
                <pre
                  className="text-base md:text-lg leading-relaxed whitespace-pre-wrap font-mono bg-white dark:bg-black p-6 rounded-xl border-2 border-black border-dashed text-black dark:text-white"
                  aria-label="Prompt text"
                >
                  {prompt.promptText}
                </pre>
              </CardContent>
            </Card>

            {/* ── Example Output ── */}
            {prompt.exampleOutput && (
              <Card className="mb-10 border-2 border-black dark:border-white rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-blue-50 dark:bg-gray-900 border-b-2 border-black p-6">
                  <CardTitle className="text-xl font-black uppercase tracking-wide">
                    Example Output
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{prompt.exampleOutput}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Example Image ── */}
            {prompt.exampleImageUrl && (
              <Card className="mb-10 border-2 border-black dark:border-white rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-pink-50 dark:bg-gray-900 border-b-2 border-black p-6">
                  <CardTitle className="text-xl font-black uppercase tracking-wide">
                    Example Visual
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <img
                    src={prompt.exampleImageUrl}
                    alt={`Example output for: ${prompt.title}`}
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
            )}

            {/* ── Why This Works ── */}
            <Card className="mb-12 bg-green-50 dark:bg-gray-900 border-2 border-black dark:border-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b-2 border-black p-6">
                <CardTitle className="text-xl font-black uppercase tracking-wide">
                  💡 Why This Prompt Works
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-green-400 text-black border border-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span className="font-medium text-lg">
                      <strong>Specific and Clear:</strong> The prompt provides clear instructions that
                      AI can follow easily
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-400 text-black border border-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span className="font-medium text-lg">
                      <strong>Structured Output:</strong> It guides the AI to produce organized,
                      actionable results
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-400 text-black border border-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span className="font-medium text-lg">
                      <strong>Battle-Tested:</strong> Used by successful creators with proven
                      engagement results
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* ── CTA Section — shown for ALL prompts ── */}
            <div className="mb-16 bg-yellow-400 rounded-[3rem] p-12 text-center border-4 border-black relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white rounded-full opacity-20 filter blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-black rounded-full opacity-10 filter blur-3xl pointer-events-none" />
              <p className="text-sm font-black uppercase tracking-widest text-black/60 mb-3 relative z-10">
                Unlock More Power
              </p>
              <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter text-black relative z-10">
                Want 500+ Prompts Like This?
              </h2>
              <p className="text-lg text-black/80 font-bold mb-8 max-w-xl mx-auto relative z-10">
                Get our curated premium packs — hand-crafted prompts for every platform, niche, and goal.
              </p>
              <Link href="/premium" className="relative z-10">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-900 border-2 border-black rounded-full px-10 py-7 text-lg font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  View Premium Packs <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* ── Related Prompts ── */}
            {relatedPrompts.length > 0 && (
              <section aria-label="Related prompts">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white mb-6 border-b-4 border-black dark:border-white pb-4">
                  Related Prompts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {relatedPrompts.map((related) => (
                    <Link
                      key={related.id}
                      href={`/prompts/${related.id}`}
                      className="group block"
                    >
                      <div className="h-full bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                        {/* Category / Platform */}
                        <div className="flex gap-2 mb-3">
                          {related.platform && (
                            <span
                              className={`text-xs font-black uppercase tracking-wide border px-2 py-0.5 rounded-full ${getPlatformClasses(related.platform)}`}
                            >
                              {related.platform}
                            </span>
                          )}
                          <span className="text-xs font-black uppercase tracking-wide bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 px-2 py-0.5 rounded-full">
                            {related.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white mb-3 leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                          {related.title}
                        </h3>

                        {/* Prompt preview */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-3 leading-relaxed">
                          {related.promptText?.slice(0, 100)}…
                        </p>

                        <span className="mt-4 inline-flex items-center text-xs font-black uppercase tracking-wide text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                          Use this prompt <ArrowRight className="ml-1 w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link href="/prompts">
                    <Button
                      variant="outline"
                      className="border-2 border-black dark:border-white font-black uppercase tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all px-8"
                    >
                      Browse All Prompts <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
