'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Eye, ArrowRight } from 'lucide-react'
import { PromptModal } from './PromptModal'

export function TrendingAICarousel() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/trending-ai-images?limit=100')
      const data = await response.json()
      if (Array.isArray(data)) {
        // Group by category, keep latest (first one found)
        const categoryMap = new Map();
        data.forEach(img => {
          if (img.category) {
            const key = img.category.toLowerCase().trim();
            if (!categoryMap.has(key)) {
              categoryMap.set(key, img);
            }
          }
        });
        
        // Convert to array and fallback to standard recent images if no categories exist
        const categoryImages = Array.from(categoryMap.values());
        setImages(categoryImages.length > 0 ? categoryImages : data.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewPrompt = (image) => {
    setSelectedImage(image)
    setShowModal(true)
    setIsPaused(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setIsPaused(false)
  }

  if (loading || images.length === 0) return null

  return (
    <section
      className="py-20 relative bg-yellow-50 dark:bg-black/50 border-y-2 border-black overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 px-4"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
          Viral AI{' '}
          <span className="underline decoration-yellow-400 decoration-8 underline-offset-4">
            Art
          </span>
        </h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 font-bold max-w-2xl mx-auto">
          Copy prompts from trending AI-generated images used by top creators.
        </p>
      </motion.div>

      {/* MARQUEE */}
      <div className="overflow-hidden w-full">
        <div
          className="flex whitespace-nowrap w-max animate-marquee"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {[...images, ...images].map((image, idx) => (
            <motion.div
              key={`${image.id}-${idx}`}
              className="inline-block w-80 mr-8"
            >
              <div className="h-full bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative aspect-square overflow-hidden bg-gray-100 border-b-2 border-black">
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'AI Generated'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link href={`/trending-ai-images?category=${encodeURIComponent(image.category || '')}`}>
                      <Button
                        className="bg-yellow-400 text-black border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Category
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-black text-lg uppercase truncate text-blue-600 dark:text-blue-400">
                    {image.category || image.title || 'Untitled'}
                  </h3>
                  <p className="font-bold text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {image.category ? (image.title || 'Untitled') : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-block bg-green-400 text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase">
                      {image.aiToolName}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View More */}
      <div className="text-center mt-10 px-4">
        <Link href="/trending-ai-images">
          <Button
            size="lg"
            className="bg-black text-white border-2 border-black px-8 py-6 text-lg font-black uppercase shadow-[4px_4px_0px_0px_#facc15]"
          >
            View Gallery
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Modal */}
      <PromptModal
        image={selectedImage}
        isOpen={showModal}
        onClose={handleModalClose}
      />

      {/* SAME MARQUEE CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee 80s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section >
  )
}
