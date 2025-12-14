import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: 'SackNest - Premium AI Prompt Library for Creators',
  description: 'Discover 500+ battle-tested AI prompts for Instagram, YouTube, TikTok & more. Create viral content faster with our premium prompt library.',
  keywords: 'AI prompts, content creation, Instagram prompts, YouTube prompts, creator tools, AI tools',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}