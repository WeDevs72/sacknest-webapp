'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, TrendingUp, Users, Copy, Check, Mail, ArrowRight, Star } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function Home() {
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts?limit=6')
      const data = await response.json()
      if (Array.isArray(data)) {
        setPrompts(data)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setEmailSubmitting(true)
    try {
      const response = await fetch('/api/email-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' })
      })

      if (response.ok) {
        toast({
          title: "Success! 🎉",
          description: "Check your email for the free prompt pack!",
        })
        setEmail('')
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setEmailSubmitting(false)
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
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                Blog
              </Link>
              {/* <Link href="/admin/login">
                <Button variant="outline" size="sm">Admin</Button>
              </Link> */}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Sparkles className="w-3 h-3 mr-1" />
            Premium AI Prompt Library
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Create Viral Content
            <br />
            With AI Prompts
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Unlock 500+ battle-tested AI prompts for Instagram, YouTube, TikTok & more. 
            <br className="hidden md:block" />
            Used by <span className="font-semibold text-purple-600 dark:text-purple-400">10,000+ creators</span> to save time and grow faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/prompts">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg">
                Browse Free Prompts
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-6 text-lg">
                Get Premium Packs
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">Why Creators Love SackNest</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Everything you need to create content that converts</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Save 10+ Hours Weekly",
                description: "Stop staring at blank screens. Get instant prompts for any content type."
              },
              {
                icon: TrendingUp,
                title: "Proven to Convert",
                description: "Prompts tested by successful creators with millions of followers."
              },
              {
                icon: Users,
                title: "All Niches Covered",
                description: "Instagram, YouTube, TikTok, LinkedIn - we've got prompts for every platform."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-purple-200 dark:border-purple-800 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sample Prompts Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore Free Prompts</h2>
          <p className="text-gray-600 dark:text-gray-400">Get a taste of what's inside</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link href={`/prompts/${prompt.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          {prompt.category}
                        </Badge>
                        {prompt.isPremium && (
                          <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{prompt.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {prompt.promptText}
                      </p>
                      <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 text-sm font-semibold">
                        View Prompt <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/prompts">
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              View All Prompts
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Email Capture Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 border-none text-white">
            <CardContent className="p-8 md:p-12 text-center">
              <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 10 Free Premium Prompts</h2>
              <p className="text-lg mb-8 opacity-90">
                Join 10,000+ creators getting weekly AI tips & exclusive prompts
              </p>
              
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white text-gray-900 border-none text-lg"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={emailSubmitting}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  {emailSubmitting ? 'Sending...' : 'Get Free Pack'}
                </Button>
              </form>
              
              <p className="text-sm mt-4 opacity-75">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-12">Trusted by Top Creators</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10,000+", label: "Active Users" },
              { number: "500+", label: "AI Prompts" },
              { number: "50,000+", label: "Content Created" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Content That Converts?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of creators using AI prompts to grow faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/premium">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg">
                Get Premium Access
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-purple-200 dark:border-purple-800 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SackNest</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Premium AI prompts for content creators & influencers
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/prompts" className="hover:text-purple-600">Browse Prompts</Link></li>
                <li><Link href="/premium" className="hover:text-purple-600">Premium Packs</Link></li>
                <li><Link href="/blog" className="hover:text-purple-600">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/privacy" className="hover:text-purple-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-purple-600">Terms & Conditions</Link></li>
                <li><Link href="/refund" className="hover:text-purple-600">Refund Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-purple-600">Twitter</a></li>
                <li><a href="#" className="hover:text-purple-600">Instagram</a></li>
                <li><a href="#" className="hover:text-purple-600">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-200 dark:border-purple-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 SackNest. All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}