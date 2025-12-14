'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [confetti, setConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after 3 seconds
    setTimeout(() => setConfetti(false), 3000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardContent className="p-12 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl font-bold mb-4 text-green-600 dark:text-green-500">
                Payment Successful! 🎉
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Thank you for your purchase. Your premium content is ready!
              </p>
            </motion.div>

            {/* Order Details */}
            {orderId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Order ID</p>
                <p className="font-mono text-sm break-all">{orderId}</p>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-4 mb-8"
            >
              <div className="flex items-start text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Check Your Email</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent your download link and purchase receipt to your email address.
                  </p>
                </div>
              </div>

              <div className="flex items-start text-left bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <Download className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Instant Access</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download your premium prompt pack immediately from the link in your email.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/prompts">
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  Browse More Prompts
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Back to Home
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Support Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-8"
            >
              Need help? Contact us at support@sacknest.com
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
