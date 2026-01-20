'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Lock, Mail } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminEmail', data.admin.email)

        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard...",
          className: "border-2 border-black bg-white text-black"
        })

        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1000)
      } else {
        if (data.message && data.message.includes('Database not configured')) {
          toast({
            title: "⚠️ Database Not Configured",
            description: "Please configure Supabase credentials in .env file.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Login Failed",
            description: data.error || 'Invalid credentials',
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title: "⚠️ Connection Error",
        description: "Please check your setup.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-14 h-14 bg-black dark:bg-white rounded-xl flex items-center justify-center border-2 border-transparent">
              <Sparkles className="w-8 h-8 text-white dark:text-black" />
            </div>
            <span className="text-4xl font-black uppercase tracking-tighter text-black dark:text-white">SackNest</span>
          </div>
          <p className="text-lg font-bold text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-gray-900 inline-block px-4 py-1 rounded-full border-2 border-gray-200 dark:border-gray-800">Admin Panel</p>
        </div>

        <Card className="border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] rounded-[2rem]">
          <CardHeader className="bg-yellow-400 border-b-4 border-black p-8 rounded-t-[1.7rem]">
            <CardTitle className="text-3xl font-black text-center uppercase tracking-tight text-black">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-black uppercase mb-2 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                    className="pl-12 h-14 text-lg font-bold border-2 border-black rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-12 h-14 text-lg font-bold border-2 border-black rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800 border-4 border-black h-16 text-xl font-black uppercase tracking-wide rounded-xl mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-1 hover:shadow-none transition-all"
              >
                {loading ? 'Logging in...' : 'Enter Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
