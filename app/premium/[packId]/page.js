'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Check, Star, Zap, ArrowRight, CreditCard, ArrowLeft, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function PremiumPackDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [pack, setPack] = useState(null)
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const [currency, setCurrency] = useState('INR')
    const [processing, setProcessing] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        if (params.packId) {
            fetchPackDetails()
        }
    }, [params.packId])

    const fetchPackDetails = async () => {
        try {
            const response = await fetch('/api/premium-packs')
            const data = await response.json()
            if (Array.isArray(data)) {
                const foundPack = data.find(p => p.id === params.packId)
                if (foundPack) {
                    setPack(foundPack)
                } else {
                    toast({
                        title: "Pack not found",
                        description: "This premium pack doesn't exist",
                        variant: "destructive"
                    })
                    router.push('/premium')
                }
            }
        } catch (error) {
            console.error('Error fetching pack:', error)
            toast({
                title: "Error",
                description: "Failed to load pack details",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePayment = async () => {
        if (!email || !pack) return

        setProcessing(true)
        try {
            const amount = currency === 'INR' ? pack.priceInr : pack.priceUsd
            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    currency,
                    customerEmail: email,
                    packId: pack.id
                })
            })

            const orderData = await orderResponse.json()

            if (!orderResponse.ok) {
                throw new Error(orderData.message || 'Failed to create order')
            }

            if (typeof window.Razorpay === 'undefined') {
                throw new Error('Razorpay SDK not loaded')
            }

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'SackNest',
                description: pack.name,
                order_id: orderData.orderId,

                method: {
                    upi: true,
                    card: true,
                    netbanking: true
                },

                handler: async function (response) {
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
                    color: '#facc15' // Yellow-400
                },
                modal: {
                    ondismiss: function () {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black font-sans flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
            </div>
        )
    }

    if (!pack) {
        return null
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center border-2 border-transparent group-hover:border-yellow-400 transition-colors">
                                <Sparkles className="w-6 h-6 text-white dark:text-black" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">SackNest</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8 font-bold">
                            <Link href="/prompts" className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-yellow-400 underline-offset-4 transition-all">
                                Browse Prompts
                            </Link>
                            <Link href="/premium" className="text-black dark:text-white hover:underline decoration-4 decoration-green-400 underline-offset-4">
                                Premium Packs
                            </Link>
                            <Link href="/blog" className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline decoration-4 decoration-blue-400 underline-offset-4 transition-all">
                                Blog
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Back Button */}
                <Link href="/premium" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-bold mb-8 group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Premium Packs
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    {/* Left Column - Pack Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-yellow-50 dark:bg-gray-800 rounded-[2.5rem] p-8 border-4 border-black dark:border-white mb-8">
                            <div className="inline-block mb-4">
                                <span className="bg-yellow-400 text-black border-2 border-black px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-black" />
                                    Premium Content
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 text-black dark:text-white">
                                {pack.name}
                            </h1>

                            <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                                {pack.description}
                            </p>

                            <div className="flex items-baseline gap-3 mb-8">
                                <span className="text-6xl font-black text-black dark:text-white">₹{pack.priceInr}</span>
                                <span className="text-3xl font-bold text-gray-500">/ ${pack.priceUsd}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-8">One-time payment • Lifetime access</p>

                            {/* Features List */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase mb-4">What's Included:</h3>
                                <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                                    {pack.description}
                                </p>

                            </div>
                        </div>

                        {/* Why Premium Section */}
                        <div className="bg-green-400 rounded-[2.5rem] p-8 border-4 border-black">
                            <h3 className="text-3xl font-black uppercase mb-6 text-black">Why Go Premium?</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: Zap,
                                        title: "Save 10+ Hours",
                                        description: "Skip the trial and error. Get prompts that work immediately."
                                    },
                                    {
                                        icon: Star,
                                        title: "Proven Results",
                                        description: "Used by creators with millions of followers."
                                    },
                                    {
                                        icon: ArrowRight,
                                        title: "Instant Access",
                                        description: "Download immediately after purchase."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start">
                                        <div className="bg-black text-green-400 p-2 rounded-lg mr-3 flex-shrink-0">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg mb-1">{item.title}</h4>
                                            <p className="text-black/80 font-semibold">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Purchase Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:sticky lg:top-24 h-fit"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
                            <div className="bg-yellow-400 p-6 border-b-4 border-black dark:border-white">
                                <h2 className="text-3xl font-black uppercase tracking-tight text-black">Complete Purchase</h2>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Currency Selection */}
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-wide mb-3 text-black dark:text-white">Select Currency</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setCurrency('INR')}
                                            className={`p-4 rounded-xl border-2 font-bold transition-all ${currency === 'INR'
                                                ? 'bg-yellow-400 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl font-black">₹{pack.priceInr}</div>
                                            <div className="text-xs uppercase mt-1">Indian Rupee</div>
                                        </button>
                                        <button
                                            onClick={() => setCurrency('USD')}
                                            className={`p-4 rounded-xl border-2 font-bold transition-all ${currency === 'USD'
                                                ? 'bg-yellow-400 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl font-black">${pack.priceUsd}</div>
                                            <div className="text-xs uppercase mt-1">US Dollar</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-wide mb-3 text-black dark:text-white">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-14 border-2 border-black dark:border-white rounded-xl text-lg font-bold bg-white dark:bg-gray-800"
                                    />
                                    <p className="text-xs font-bold text-gray-400 mt-2">📧 Download link will be sent here</p>
                                </div>

                                {/* Total */}
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border-2 border-black dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold text-gray-600 dark:text-gray-400">Total</span>
                                        <span className="text-4xl font-black text-green-600">
                                            {currency === 'INR' ? `₹${pack.priceInr}` : `$${pack.priceUsd}`}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">One-time payment</p>
                                </div>

                                {/* Buy Button */}
                                <Button
                                    onClick={handlePayment}
                                    disabled={!email || processing}
                                    className="w-full bg-black hover:bg-gray-800 text-white border-2 border-black h-16 text-xl font-black uppercase rounded-xl shadow-[6px_6px_0px_0px_#facc15] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-6 h-6 mr-3" />
                                            Pay Securely
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-center font-bold text-gray-400 uppercase tracking-widest">
                                    🔒 Secure payment via Razorpay
                                </p>

                                {/* Trust Signals */}
                                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                                    <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                                        <Check className="w-5 h-5 mr-2 text-green-500" />
                                        Instant access after payment
                                    </div>
                                    <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                                        <Check className="w-5 h-5 mr-2 text-green-500" />
                                        Lifetime access & updates
                                    </div>
                                    <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                                        <Check className="w-5 h-5 mr-2 text-green-500" />
                                        Email support included
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
