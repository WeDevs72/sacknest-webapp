'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" suppressHydrationWarning>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
