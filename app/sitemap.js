import { getAllPrompts } from '@/lib/prompts-data'
import { supabaseServer as supabase } from '@/lib/supabase-server'

export default async function sitemap() {
  const baseUrl = 'https://sacknest.com'

  // Static pages
  const staticPages = [
    '',
    '/prompts',
    '/premium',
    '/blog',
    '/trending-ai-images',
    '/aboutus',
    '/faqs',
    '/privacy',
    '/terms',
    '/refund',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/prompts' || route === '/premium' ? 0.9 : 0.7,
  }))

  // Dynamic blog pages — query Supabase directly (no HTTP round-trip)
  let blogPages = []
  try {
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updatedAt, createdAt')
      .eq('published', true)
      .order('createdAt', { ascending: false })

    if (Array.isArray(blogs)) {
      blogPages = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt || blog.createdAt || new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  // Dynamic prompt pages — query Supabase directly (no HTTP round-trip)
  let promptPages = []
  try {
    const prompts = await getAllPrompts()
    promptPages = prompts.map((prompt) => ({
      url: `${baseUrl}/prompts/${prompt.id}`,
      lastModified: prompt.updatedAt || prompt.createdAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching prompts for sitemap:', error)
  }

  return [...staticPages, ...blogPages, ...promptPages]
}

