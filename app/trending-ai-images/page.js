'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Search, Eye, ArrowLeft, Menu } from 'lucide-react'
import { PromptModal } from '@/components/PromptModal'
import SidebarCategories from '@/components/SidebarCategories'
import MobileDrawer from '@/components/MobileDrawer'
import logo from '@/public/logo_header.png'


export default function TrendingAIImagesPage() {
  const [images, setImages] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchImages()
  }, [selectedCategory])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredImages(images)
      return
    }

    const query = searchQuery.toLowerCase()
    setFilteredImages(
      images.filter(img =>
        img?.title?.toLowerCase().includes(query) ||
        img?.aiToolName?.toLowerCase().includes(query) ||
        img?.promptText?.toLowerCase().includes(query) ||
        img?.category?.toLowerCase().includes(query)
      )
    )
  }, [searchQuery, images])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/trending-ai-image-categories')
      const data = await response.json()
      if (Array.isArray(data)) setCategories(['all', ...data])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchImages = async () => {
    setLoading(true)
    try {
      const url = selectedCategory === 'all'
        ? '/api/trending-ai-images'
        : `/api/trending-ai-images?category=${encodeURIComponent(selectedCategory)}`
      const response = await fetch(url)
      const data = await response.json()
      if (Array.isArray(data)) {
        setImages(data)
        setFilteredImages(data)
      }
    } catch (err) {
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewPrompt = (image) => {
    setSelectedImage(image)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <SidebarCategories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat)
            setIsDrawerOpen(false)
          }}
        />
      </MobileDrawer>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image src={logo} alt="SackNest Logo" className="w-10 h-10" />
              <span className="text-3xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">SackNest</span>
            </Link>

            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none ml-2"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu className="w-6 h-6 text-black dark:text-white" />
            </button>

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

      {/* Main Content */}
      <main className="flex">
        {/* Sidebar – desktop */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-6rem)] bg-white border-r border-gray-200 rounded-lg shadow-sm p-4 m-4">
            <SidebarCategories
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </aside>

        {/* Gallery Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="container mx-auto px-4 py-12">
            <Link href="/">
              <Button variant="ghost" className="mb-8 pl-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
                AI Image{' '}
                <span className="bg-yellow-400 px-2 border-2 border-black inline-block -skew-x-3">
                  Gallery
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-bold">
                Explore viral AI-generated images and copy their prompts instantly.
              </p>
            </motion.div>

            {/* Search */}
            <div className="max-w-3xl mx-auto mb-16 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, AI tool, category, or prompt..."
                className="pl-16 py-8 text-xl border-4 border-black rounded-2xl font-bold"
              />
            </div>

            {/* GRID GALLERY */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
              </div>
            ) : filteredImages.length === 0 ? (
              <p className="text-center font-bold text-xl py-20">
                No images found.
              </p>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="rounded-[2rem] overflow-hidden border-2 border-black shadow-[8px_8px_0_0_#000] group hover:-translate-y-1 transition-all duration-300">
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={image.imageUrl}
                          alt={image.title || 'AI Generated'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Button
                            onClick={() => handleViewPrompt(image)}
                            className="bg-yellow-400 text-black border-2 border-black font-black"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Prompt
                          </Button>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-black uppercase truncate">
                          {image.title || 'Untitled'}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-block text-xs bg-green-400 px-3 py-1 border-2 border-black rounded-full font-black">
                            {image.aiToolName}
                          </span>
                          {image.category && (
                            <span className="inline-block text-xs bg-blue-100 text-blue-800 px-3 py-1 border-2 border-blue-300 rounded-full font-black">
                              {image.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <PromptModal
        image={selectedImage}
        isOpen={showModal}
        onClose={handleModalClose}
      />
    </div>
  )
}
