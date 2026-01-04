'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export function PromptModal({ image, isOpen, onClose }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!image) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(image.promptText)
      setCopied(true)
      toast({
        title: "Prompt Copied! 📋",
        description: "The AI prompt has been copied to your clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {image.title || 'AI Image Prompt'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={image.imageUrl} 
              alt={image.title || 'AI Generated'}
              className="w-full h-auto max-h-96 object-contain bg-gray-100 dark:bg-gray-800"
            />
          </div>

          {/* AI Tool Info */}
          <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Generated with</p>
              <p className="font-bold text-lg text-purple-600 dark:text-purple-400">{image.aiToolName}</p>
            </div>
            {image.aiToolUrl && (
              <a 
                href={image.aiToolUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Visit Tool
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Prompt Text */}
          <div>
            <label className="block text-sm font-semibold mb-2">AI Prompt:</label>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {image.promptText}
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <Button 
            onClick={handleCopy}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            size="lg"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copy Prompt
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
