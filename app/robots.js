export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/payment-success/', '/download/'],
      },
    ],
    sitemap: 'https://sacknest.com/sitemap.xml',
  }
}
