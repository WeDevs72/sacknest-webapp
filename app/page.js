'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, TrendingUp, Users, Copy, Check, Mail, ArrowRight, Star, Filter } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { TrendingAICarousel } from '@/components/TrendingAICarousel'
import logo from '@/public/logo_header.png'

export default function Home() {
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [index, setIndex] = useState(0);


  const roles = [
    "INFLUENCER",
    "CREATOR",
    "FREELANCER",
    "MARKETER",
    "DESIGNER",
  ];

  useEffect(() => {
    fetchPrompts();
    fetchCategories();
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const fetchPrompts = async () => {
    try {
      const url = selectedCategory === 'all'
        ? '/api/prompts?limit=6'
        : `/api/prompts?limit=6&category=${encodeURIComponent(selectedCategory)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPrompts(data);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(['all', ...data]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image src={logo} alt="SackNest Logo" className="w-10 h-10" />
              <span className="text-3xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">SackNest</span>
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

      <section className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[0.85] tracking-tighter text-black dark:text-white uppercase">
            Ready To Paste
          </h1>

          <div className="mt-4 flex justify-center">
            <div className="relative inline-flex items-center px-8 py-4 bg-black dark:bg-white transform -skew-x-6">
              {/* Unskew content */}
              <div className="flex items-center gap-3 transform skew-x-6 text-white dark:text-black font-black uppercase text-3xl md:text-5xl lg:text-6xl leading-none">
                AI PROMPT FOR

                {/* Fixed-width rotating word */}
                <span className="relative inline-block w-[10ch] h-[1em] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={roles[index]}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="absolute left-0 top-0"
                    >
                      {roles[index]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xl md:text-3xl text-gray-800 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-medium leading-normal">
            Unleash your creative potential with the world's largest AI prompt library.
            Trusted by creators who mean business.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
            <Link href="/prompts">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black rounded-full px-12 py-8 text-xl font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Browse Prompts <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white rounded-full px-12 py-8 text-xl font-black uppercase tracking-wide hover:bg-gray-100 dark:hover:bg-gray-900">
                Premium Packs
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Trending AI Carousel */}
      <TrendingAICarousel />

      {/* Features Section */}
      <section className="px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black text-center mb-6 uppercase tracking-tight text-black dark:text-white">Why <span className="text-green-500 underline decoration-4 decoration-black dark:decoration-white">SackNest</span>?</h2>
          <p className="text-center text-2xl text-gray-700 dark:text-gray-300 mb-20 max-w-3xl mx-auto font-bold">Everything you need to create content that converts, faster than ever.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Save 10+ Hours",
                description: "Stop staring at blank screens. Get instant prompts for any content type.",
                color: "bg-yellow-400",
              },
              {
                icon: TrendingUp,
                title: "Proven to Convert",
                description: "Prompts tested by successful creators with millions of followers.",
                color: "bg-green-400",
              },
              {
                icon: Users,
                title: "All Niches",
                description: "Instagram, YouTube, TikTok, LinkedIn - we've got prompts for every platform.",
                color: "bg-blue-400",
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-full bg-white dark:bg-gray-900 rounded-[2rem] p-8 border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 border-2 border-black`}>
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 uppercase">{feature.title}</h3>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-bold">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sample Prompts Section */}
      <section className="px-8 py-24 bg-yellow-50 dark:bg-gray-900 border-y-2 border-black dark:border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight text-black dark:text-white">Explore <span className="bg-black text-white px-4 transform -rotate-2 inline-block">Free Prompts</span></h2>
          <p className="text-2xl text-black dark:text-white font-bold">Get a taste of what's inside</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white dark:bg-gray-800 animate-pulse rounded-3xl border-2 border-black" />
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
                  <div className="h-full bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-black dark:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 cursor-pointer group hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-6">
                      <span className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white border-2 border-black dark:border-gray-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        {prompt.category}
                      </span>
                      {prompt.isPremium && (
                        <span className="bg-yellow-400 text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Star className="w-3 h-3 mr-1 fill-black" />
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black mb-4 group-hover:underline decoration-2 underline-offset-2 uppercase">{prompt.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 font-medium border-l-4 border-gray-200 pl-4 italic">
                      "{prompt.promptText}"
                    </p>
                    <div className="flex items-center text-black dark:text-white font-black group-hover:translate-x-2 transition-transform">
                      View Prompt <ArrowRight className="ml-2 w-5 h-5 bg-black text-white rounded-full p-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link href="/prompts">
            <Button size="lg" variant="outline" className="bg-white text-black border-2 border-black rounded-full px-10 py-8 text-xl font-black uppercase tracking-wide hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              View All Prompts
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Email Capture Section */}
      {/* <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-black dark:bg-white rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border-4 border-yellow-400">
           
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-green-400 rounded-full mix-blend-exclusion filter blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-pink-500 rounded-full mix-blend-exclusion filter blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <Mail className="w-20 h-20 mx-auto mb-8 text-yellow-400 dark:text-black" />

              <h2 className="text-5xl md:text-7xl font-black mb-8 text-white dark:text-black uppercase tracking-tighter leading-none">
                Get 10 Free <span className="text-yellow-400 dark:text-blue-600 underline decoration-wavy decoration-4">Premium Prompts</span>
              </h2>

              <p className="text-2xl text-gray-300 dark:text-gray-600 mb-12 font-bold max-w-2xl mx-auto">
                Join <span className="text-white dark:text-black bg-gray-800 dark:bg-gray-100 px-2">10,000+ creators</span> getting weekly AI tips directly to their inbox.
              </p>

              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
              >
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-4 border-transparent focus:border-yellow-400 text-black placeholder:text-gray-500 text-xl h-16 rounded-2xl px-6 font-bold"
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={emailSubmitting}
                  className="h-16 rounded-2xl text-black text-xl font-black uppercase bg-yellow-400 hover:bg-yellow-300 transition-colors px-10 border-4 border-transparent"
                >
                  {emailSubmitting ? 'Sending...' : 'Join Now'}
                </Button>
              </form>

              <p className="text-sm mt-8 text-gray-500 font-bold uppercase tracking-widest">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.div>
      </section> */}

      {/* CTA Section */}
      <section className="px-8 pb-32 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-6xl md:text-8xl font-black mb-8 uppercase tracking-tighter text-black dark:text-white leading-none">
            Ready to <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 animate-gradient">Dominate?</span>
          </h2>
          <p className="text-3xl text-gray-600 dark:text-gray-300 mb-12 font-bold">
            Join thousands of creators growing 10x faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/premium">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white border-2 border-black dark:border-white px-12 py-10 text-2xl font-black rounded-full shadow-[8px_8px_0px_0px_#facc15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                Get Premium
                <ArrowRight className="ml-4 w-8 h-8" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white border-t-8 border-yellow-400">
        <div className="px-8 py-20">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-4 border-yellow-400">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-white">SackNest</span>
              </div>
              <p className="text-gray-400 font-bold text-lg leading-relaxed">
                Premium AI prompts for content creators, marketers & influencers.
                <br /><span className="text-yellow-400">Level up your content game.</span>
              </p>
            </div>

            <div>
              <h4 className="font-black text-xl mb-8 uppercase tracking-widest text-yellow-400">Product</h4>
              <ul className="space-y-4 font-bold text-lg text-gray-300">
                <li><Link href="/prompts" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">Browse Prompts</Link></li>
                <li><Link href="/premium" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">Premium Packs</Link></li>
                <li><Link href="/blog" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xl mb-8 uppercase tracking-widest text-yellow-400">Legal</h4>
              <ul className="space-y-4 font-bold text-lg text-gray-300">
                <li><Link href="/faqs" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">FAQ's</Link></li>
                <li><Link href="/privacy" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">Terms & Conditions</Link></li>
                <li><Link href="/refund" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">Refund Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xl mb-8 uppercase tracking-widest text-yellow-400">Company</h4>
              <ul className="space-y-4 font-bold text-lg text-gray-300">
                <li><a href="/aboutus" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">About</a></li>
                <li><a href="https://www.instagram.com/sack.nest/?igsh=MW1qdnVoNXM2eGRybA%3D%3D#" className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">Instagram</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-20 pt-10 text-center font-bold text-gray-500 uppercase tracking-widest">
            <p>© 2025 SackNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}