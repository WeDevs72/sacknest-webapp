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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-black rounded-[2rem] p-0 bg-white dark:bg-black">
        <DialogHeader className="bg-yellow-400 p-6 border-b-4 border-black relative">
          {/* Abstract pattern */}
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <div className="w-16 h-16 rounded-full border-4 border-black bg-white"></div>
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight text-black relative z-10">
            {image.title || 'AI Image Prompt'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {/* Image Preview */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <img
              src={image.imageUrl}
              alt={image.title || 'AI Generated'}
              className="w-full h-auto max-h-96 object-contain bg-gray-100 dark:bg-gray-800"
            />
          </div>

          {/* AI Tool Info */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-5 rounded-xl border-2 border-black">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Generated with</p>
              <p className="font-black text-xl text-black dark:text-white uppercase">{image.aiToolName}</p>
            </div>
            {image.aiToolUrl && (
              <a
                href={image.aiToolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-black dark:text-white hover:underline decoration-2 underline-offset-4 flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                Visit Tool
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Prompt Text */}
          <div>
            <label className="block text-sm font-black uppercase mb-2 ml-1 text-black dark:text-white">AI Prompt:</label>
            <div className="bg-white dark:bg-black p-5 rounded-2xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="text-base leading-relaxed whitespace-pre-wrap font-medium text-gray-800 dark:text-gray-200">
                {image.promptText}
              </p>
            </div>
          </div>

          {image.note && (
            <div>
              <label className="block text-sm font-black uppercase mb-2 ml-1 text-black dark:text-white">Note:</label>
              <div className="bg-yellow-50 dark:bg-gray-900 p-5 rounded-2xl border-2 border-black dark:border-white border-dashed">
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-gray-800 dark:text-gray-200">
                  {image.note}
                </p>
              </div>
            </div>
          )}

          {/* Copy Button */}
          <Button
            onClick={handleCopy}
            className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black h-14 text-lg font-black uppercase tracking-wide rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            size="lg"
          >
            {copied ? (
              <>
                <Check className="w-6 h-6 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-6 h-6 mr-2" />
                Copy Prompt
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
