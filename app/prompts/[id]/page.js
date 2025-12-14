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
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Prompt Not Found</h1>
          <Link href="/prompts">
            <Button>Back to Prompts</Button>
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
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">SackNest</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Link href="/prompts">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
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
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {prompt.category}
              </Badge>
              {prompt.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {prompt.title}
            </h1>
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, i) => (
                  <span key={i} className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Prompt Card */}
          <Card className="mb-8 border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <CardTitle className="flex items-center justify-between">
                <span>Prompt</span>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {copied ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy Prompt</>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                {prompt.promptText}
              </p>
            </CardContent>
          </Card>

          {/* Example Output */}
          {prompt.exampleOutput && (
            <Card className="mb-8 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>Example Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{prompt.exampleOutput}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Example Image */}
          {prompt.exampleImageUrl && (
            <Card className="mb-8 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>Example Visual</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={prompt.exampleImageUrl} 
                  alt="Example" 
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Why This Works Section */}
          <Card className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle>💡 Why This Prompt Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Specific and Clear:</strong> The prompt provides clear instructions that AI can follow easily</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Structured Output:</strong> It guides the AI to produce organized, actionable results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Battle-Tested:</strong> Used by successful creators with proven engagement results</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          {prompt.isPremium && (
            <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Want More Premium Prompts Like This?</h3>
                <p className="mb-6 opacity-90">Get access to 500+ exclusive prompts in our premium packs</p>
                <Link href="/premium">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                    View Premium Packs
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
