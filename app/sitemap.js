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

  // Dynamic blog pages
  let blogPages = []
  try {
    const res = await fetch(`${baseUrl}/api/blogs`, { next: { revalidate: 3600 } })
    const blogs = await res.json()
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

  // Dynamic prompt pages
  let promptPages = []
  try {
    const res = await fetch(`${baseUrl}/api/prompts`, { next: { revalidate: 3600 } })
    const prompts = await res.json()
    if (Array.isArray(prompts)) {
      promptPages = prompts.map((prompt) => ({
        url: `${baseUrl}/prompts/${prompt.id}`,
        lastModified: prompt.updatedAt || prompt.createdAt || new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.5,
      }))
    }
  } catch (error) {
    console.error('Error fetching prompts for sitemap:', error)
  }

  return [...staticPages, ...blogPages, ...promptPages]
}
