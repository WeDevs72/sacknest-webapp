'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sparkles, Check, Star, Zap, ArrowRight, CreditCard } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function PremiumPage() {
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPack, setSelectedPack] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [email, setEmail] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPacks()
  }, [])

  const fetchPacks = async () => {
    try {
      const response = await fetch('/api/premium-packs')
      const data = await response.json()
      if (Array.isArray(data)) {
        setPacks(data)
      }
    } catch (error) {
      console.error('Error fetching packs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = (pack) => {
    setSelectedPack(pack)
    setShowCheckout(true)
  }

  const handlePayment = async () => {
    if (!email || !selectedPack) return

    setProcessing(true)
    try {
      // Create Razorpay order
      const amount = currency === 'INR' ? selectedPack.priceInr : selectedPack.priceUsd
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          customerEmail: email,
          packId: selectedPack.id
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create order')
      }

      // Load Razorpay checkout
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded')
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SackNest',
        description: selectedPack.name,
        order_id: orderData.orderId,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })
          })

          if (verifyResponse.ok) {
            // Redirect to secure download page
            window.location.href = `/download/${response.razorpay_order_id}`
          } else {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support",
              variant: "destructive"
            })
          }
        },
        prefill: {
          email: email
        },
        theme: {
          color: '#9333ea'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You can try again anytime"
            })
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
      setProcessing(false)
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Error",
        description: error.message || 'Something went wrong',
        variant: "destructive"
      })
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-purple-200 dark:border-purple-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">SackNest</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/prompts" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                Browse Prompts
              </Link>
              <Link href="/premium" className="text-purple-600 dark:text-purple-400 font-semibold">
                Premium Packs
              </Link>
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Premium Content
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Premium Prompt Packs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Unlock exclusive AI prompts used by top creators. Save hours of trial and error with battle-tested prompts.
          </p>
        </motion.div>

        {/* Packs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packs.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-2xl">
                  <CardHeader className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                    <CardTitle className="text-2xl">{pack.name}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {pack.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 p-6">
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold">₹{pack.priceInr}</span>
                        <span className="text-gray-500">/ ${pack.priceUsd}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">One-time payment</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>50+ Premium Prompts</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Battle-tested by top creators</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Instant download access</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Lifetime updates</span>
                      </li>
                    </ul>

                    <Button 
                      onClick={() => handleBuyNow(pack)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      size="lg"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Premium?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Save Time",
                description: "Skip the trial and error. Get prompts that work immediately."
              },
              {
                icon: Star,
                title: "Proven Results",
                description: "Used by creators with millions of followers and engagements."
              },
              {
                icon: ArrowRight,
                title: "Instant Access",
                description: "Download immediately after purchase. Start creating today."
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
         
        </motion.div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
          </DialogHeader>
          {selectedPack && (
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{selectedPack.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{selectedPack.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Currency</label>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="INR">INR - ₹{selectedPack.priceInr}</option>
                      <option value="USD">USD - ${selectedPack.priceUsd}</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Total</label>
                    <div className="text-2xl font-bold">
                      {currency === 'INR' ? `₹${selectedPack.priceInr}` : `$${selectedPack.priceUsd}`}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Email Address</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Download link will be sent to this email</p>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={!email || processing}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="lg"
              >
                {processing ? 'Processing...' : 'Proceed to Payment'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-xs text-center text-gray-500">
                Secure payment powered by Razorpay
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
