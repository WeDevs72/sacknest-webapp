'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function DownloadPage() {
  const params = useParams()
  const [order, setOrder] = useState(null)
  const [pack, setPack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (params.orderId) {
      fetchOrderDetails()
    }
  }, [params.orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${params.orderId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Order not found')
      }

      setOrder(data.order)
      setPack(data.pack)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/download/${params.orderId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Download failed')
      }

      // Open download URL in new tab
      window.open(data.downloadUrl, '_blank')
    } catch (err) {
      alert(err.message)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 dark:border-red-800">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Link href="/premium">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                Browse Premium Packs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (order?.status !== 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your payment is being processed. Please complete the payment to access your premium content.
            </p>
            <Link href="/premium">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                Back to Premium Packs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardContent className="p-12">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6 text-center"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-green-600 dark:text-green-500">
                Payment Successful! 🎉
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Your premium content is ready to download
              </p>
            </div>

            {/* Pack Details */}
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{pack?.name}</span>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                    Premium
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {pack?.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Order ID:</span>
                    <div className="font-mono text-xs mt-1">{order?.razorpayOrderId}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount Paid:</span>
                    <div className="font-bold mt-1">
                      {order?.currency === 'INR' ? '₹' : '$'}{parseFloat(order?.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Button */}
            <div className="text-center mb-8">
              <Button
                onClick={handleDownload}
                disabled={downloading || !pack?.fileUrl}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-lg"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Premium Prompts
                  </>
                )}
              </Button>

              {!pack?.fileUrl && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  ⚠️ File is being prepared. Please contact support if this persists.
                </p>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email Confirmation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We're sending your download link and receipt to <strong>{order?.customerEmail}</strong>. Check your inbox (and spam folder) within a few minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start text-left bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <Download className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Lifetime Access</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Save this link to download your prompts anytime. Access never expires.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-sm text-gray-600 dark:text-gray-400">
              <Lock className="w-4 h-4 inline mr-2" />
              Secure download link • Valid for 24 hours • Can be refreshed anytime
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/prompts" className="flex-1">
                <Button variant="outline" className="w-full">
                  Browse More Prompts
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Support Note */}
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
              Need help? Contact us at support@sacknest.com
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
