'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, Check, Star, Zap, ArrowRight, CreditCard } from 'lucide-react'
import { detectCurrency, formatPrice } from '@/lib/currency'
import Image from 'next/image'
import logo from '@/public/logo_header.png'


export default function PremiumPage() {
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState('INR') // Default to INR

  useEffect(() => {
    fetchPacks()
    // Detect user's currency based on location
    detectCurrency().then(detectedCurrency => {
      setCurrency(detectedCurrency)
    })
  }, [])

  const fetchPacks = async () => {
    try {
      const response = await fetch('/api/premium-packs')
      const data = await response.json()
      if (Array.isArray(data)) {
        setPacks(data)
      }
    } catch (error) {
      console.error('Error fetching packs:', error)
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
              <Link href="/premium" className="text-black dark:text-white hover:underline decoration-4 decoration-green-400 underline-offset-4">
                Premium Packs
              </Link>
              <Link href="/blog" className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-blue-400 underline-offset-4 transition-all">
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
          className="text-center mb-20 relative">

          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-black border-2 border-black px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <Star className="w-4 h-4 fill-black" />
              Premium Content
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 uppercase tracking-tighter text-black dark:text-white leading-[0.9]">
            Premium <br /><span className="text-white bg-black px-4 transform -skew-x-6 inline-block">Pro Packs</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-bold leading-relaxed">
            Unlock exclusive AI prompts used by top creators. Save hours of trial and error with battle-tested workflows.
          </p>
        </motion.div>

        {/* Packs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2.5rem] border-2 border-black" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packs.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <div className="bg-yellow-50 dark:bg-gray-800 p-6 border-b-2 border-black dark:border-white">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{pack.name}</h3>
                    {/* <p className="text-lg font-bold text-gray-600 dark:text-gray-300 leading-tight">
                      {pack.description}
                    </p> */}
                  </div>

                  <div className="flex-1 p-8">
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-5xl font-black">{formatPrice(pack.priceInr, pack.priceUsd, currency)}</span>
                        <span className="text-sm font-bold text-gray-500 uppercase">{currency}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">One-time payment</p>
                    </div>

                    <p className="text-lg font-bold text-gray-600 dark:text-gray-300 leading-tight mb-8">
                      {pack.description}
                    </p>

                    <Link href={`/premium/${pack.id}`} className="block w-full">
                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white border-2 border-black text-xl py-6 rounded-2xl font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#facc15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        <ArrowRight className="w-6 h-6 mr-3" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-5xl mx-auto mb-20"
        >
          <div className="bg-green-400 rounded-[3rem] p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-12 uppercase tracking-tighter text-black">Why Go Premium?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Save Time",
                  description: "Skip the trial and error. Get prompts that work immediately."
                },
                {
                  icon: Star,
                  title: "Proven Results",
                  description: "Used by creators with millions of followers."
                },
                {
                  icon: ArrowRight,
                  title: "Instant Access",
                  description: "Download immediately after purchase. Start creating today."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border-2 border-black text-center">
                  <div className="w-16 h-16 bg-black text-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-black">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-xl mb-2 uppercase">{feature.title}</h3>
                  <p className="text-gray-800 font-bold leading-tight">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
