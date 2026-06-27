'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

/**
 * Thin client component that handles copy-to-clipboard for a prompt.
 * Kept separate so the parent detail page can be a Server Component.
 */
export default function CopyPromptButton({ promptText }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText)
    setCopied(true)
    toast({
      title: 'Copied! 📋',
      description: 'Prompt copied to clipboard',
      className: 'border-2 border-black',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      onClick={handleCopy}
      size="sm"
      className="bg-black text-white hover:bg-gray-800 border-2 border-black font-bold uppercase tracking-wide"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" /> Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" /> Copy Prompt
        </>
      )}
    </Button>
  )
}
