import { MetadataRoute } from 'next'
import { supabaseServer } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sacknest.com'

  // 1. Static pages
  const staticPaths = [
    '',
    '/premium',
    '/faqs',
    '/aboutus',
    '/privacy',
    '/terms',
    '/refund',
  ]

  const staticPages = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 2. /prompts index page
  const promptsIndex = {
    url: `${baseUrl}/prompts`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }

  // 3. /blog index page
  const blogIndex = {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }

  // 4. Each /prompts/[slug] -> 300 prompts with IDs: prompt_001 to prompt_300
  const promptPages = Array.from({ length: 300 }, (_, i) => {
    const num = String(i + 1).padStart(3, '0')
    return {
      url: `${baseUrl}/prompts/prompt_${num}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  // 5. Each /blog/[slug] -> fetch from database (Supabase blogs table where published is true)
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const { data: blogs } = await supabaseServer
      .from('blogs')
      .select('slug')
      .eq('published', true)
      .order('createdAt', { ascending: false })

    if (Array.isArray(blogs)) {
      blogPages = blogs.map((blog: { slug: string }) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  return [...staticPages, promptsIndex, blogIndex, ...promptPages, ...blogPages]
}
