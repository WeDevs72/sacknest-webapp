import './globals.css'
import { Providers } from '@/components/providers'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata = {
  title: 'SackNest - Premium AI Prompt Library for Creators',
  description:
    'Discover 500+ battle-tested AI prompts for Instagram, YouTube, TikTok & more. Create viral content faster with our premium prompt library.',
  keywords:
    'AI prompts, content creation, Instagram prompts, YouTube prompts, creator tools, AI tools',
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