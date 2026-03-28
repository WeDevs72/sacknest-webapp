import './globals.css'
import { Providers } from '@/components/providers'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata = {
  metadataBase: new URL('https://sacknest.com'),
  title: {
    default: 'SackNest - Premium AI Prompt Library for Creators',
    template: '%s | SackNest',
  },
  description:
    'Discover 500+ battle-tested AI prompts for Instagram, YouTube, TikTok & more. Create viral content faster with our premium prompt library.',
  keywords:
    'AI prompts, content creation, Instagram prompts, YouTube prompts, creator tools, AI tools, ChatGPT prompts, MidJourney prompts, prompt engineering',
  authors: [{ name: 'SackNest' }],
  creator: 'SackNest',
  publisher: 'SackNest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sacknest.com',
    siteName: 'SackNest',
    title: 'SackNest - Premium AI Prompt Library for Creators',
    description:
      'Discover 500+ battle-tested AI prompts for Instagram, YouTube, TikTok & more. Create viral content faster.',
    images: [
      {
        url: '/logo_header.png',
        width: 512,
        height: 512,
        alt: 'SackNest Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SackNest - Premium AI Prompt Library for Creators',
    description:
      'Discover 500+ battle-tested AI prompts for Instagram, YouTube, TikTok & more.',
    images: ['/logo_header.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here when you have it
    google: 't0nIppd6o-fQZWoJio5lI4P3Js10ysBzGKZQSfhfg2Y',
  },
  alternates: {
    canonical: 'https://sacknest.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <GoogleAnalytics gaId={process.env.G_TAG} />
      </body>
    </html>
  )
}