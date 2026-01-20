'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Copy, Check, Star, ArrowLeft, ArrowRight } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import ReactMarkdown from 'react-markdown'

export default function PromptDetailPage() {
  const params = useParams()
  const [prompt, setPrompt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      fetchPrompt()
    }
  }, [params.id])

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPrompt(data)
      }
    } catch (error) {
      console.error('Error fetching prompt:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.promptText)
      setCopied(true)
      toast({
        title: "Copied! 📋",
        description: "Prompt copied to clipboard",
        className: "border-2 border-black"
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black dark:border-white"></div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-6 uppercase">Prompt Not Found</h1>
          <Link href="/prompts">
            <Button className="border-2 border-black">Back to Prompts</Button>
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
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center border-2 border-transparent group-hover:border-yellow-400 transition-colors">
                <Sparkles className="w-6 h-6 text-white dark:text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">SackNest</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Link href="/prompts">
          <Button variant="ghost" className="mb-8 hover:bg-transparent hover:text-yellow-600 pl-0 text-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Prompts
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-2 border-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {prompt.category}
              </span>
              {prompt.isPremium && (
                <span className="bg-yellow-400 text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Star className="w-3 h-3 mr-1 fill-black" />
                  Premium
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-black dark:text-white leading-[1.1]">
              {prompt.title}
            </h1>
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, i) => (
                  <span key={i} className="text-sm font-bold bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 px-3 py-1 rounded-lg uppercase tracking-wide">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Prompt Card */}
          <Card className="mb-10 border-4 border-black dark:border-white rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader className="bg-gray-100 dark:bg-gray-900 border-b-4 border-black flex flex-row items-center justify-between p-6">
              <CardTitle className="text-xl font-black uppercase tracking-wide">Prompt</CardTitle>
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="bg-black text-white hover:bg-gray-800 border-2 border-black font-bold uppercase tracking-wide"
              >
                {copied ? (
                  <><Check className="w-4 h-4 mr-2" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> Copy Prompt</>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-lg leading-relaxed whitespace-pre-wrap font-mono bg-white dark:bg-black p-6 rounded-xl border-2 border-black border-dashed">
                {prompt.promptText}
              </div>
            </CardContent>
          </Card>

          {/* Example Output */}
          {prompt.exampleOutput && (
            <Card className="mb-10 border-2 border-black dark:border-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-gray-900 border-b-2 border-black p-6">
                <CardTitle className="text-xl font-black uppercase tracking-wide">Example Output</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{prompt.exampleOutput}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Example Image */}
          {prompt.exampleImageUrl && (
            <Card className="mb-10 border-2 border-black dark:border-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-pink-50 dark:bg-gray-900 border-b-2 border-black p-6">
                <CardTitle className="text-xl font-black uppercase tracking-wide">Example Visual</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={prompt.exampleImageUrl}
                  alt="Example"
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          )}

          {/* Why This Works Section */}
          <Card className="mb-12 bg-green-50 dark:bg-gray-900 border-2 border-black dark:border-white rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b-2 border-black p-6">
              <CardTitle className="text-xl font-black uppercase tracking-wide">💡 Why This Prompt Works</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-green-400 text-black border border-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 font-bold">✓</span>
                  <span className="font-medium text-lg"><strong>Specific and Clear:</strong> The prompt provides clear instructions that AI can follow easily</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-400 text-black border border-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 font-bold">✓</span>
                  <span className="font-medium text-lg"><strong>Structured Output:</strong> It guides the AI to produce organized, actionable results</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-400 text-black border border-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 font-bold">✓</span>
                  <span className="font-medium text-lg"><strong>Battle-Tested:</strong> Used by successful creators with proven engagement results</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          {prompt.isPremium && (
            <div className="bg-black text-white rounded-[2.5rem] p-12 text-center border-4 border-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Want More Premium Prompts?</h3>
              <p className="mb-8 opacity-90 text-lg font-bold">Get access to 500+ exclusive prompts in our premium packs</p>
              <Link href="/premium">
                <Button size="lg" className="bg-yellow-400 text-black hover:bg-white border-2 border-white hover:border-black text-xl py-6 px-10 rounded-xl font-black uppercase tracking-wide transition-all">
                  View Premium Packs
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
